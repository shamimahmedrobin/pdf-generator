'use client';

import React, {useEffect, useRef, useState} from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eraser,
  FileUp,
  MousePointer2,
  PencilLine,
  Plus,
  Trash2,
  Type,
  X,
} from 'lucide-react';
import type {PDFDocumentProxy} from 'pdfjs-dist';
import type {PdfTemplateMeta, TemplateField} from '@/types/template';
import {TEMPLATE_FONTS} from '@/types/template';
import {
  deletePdfBytes,
  loadPdfBytes,
  loadTemplateMetas,
  nowMs,
  savePdfBytes,
  saveTemplateMetas,
  uid,
} from '@/lib/template-store';
import {
  downloadBlob,
  generateFromTemplate,
  openPdf,
  renderPage,
} from '@/lib/template-pdf';

type Mode = 'edit' | 'fill';

interface PageView {
  dataUrl: string;
  widthPt: number;
  heightPt: number;
  displayW: number;
  displayH: number;
}

const COLOR_PRESETS = ['#000000', '#666666', '#1e3a8a', '#b91c1c', '#047857'];

export default function TemplateMakerView() {
  const [metas, setMetas] = useState<PdfTemplateMeta[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const pdfBytesRef = useRef<ArrayBuffer | null>(null);
  const [pageIdx, setPageIdx] = useState(0);
  const [pageView, setPageView] = useState<PageView | null>(null);
  const [mode, setMode] = useState<Mode>('edit');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const viewerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<
    | {kind: 'create'; startX: number; startY: number}
    | {kind: 'move'; fieldId: string; dx: number; dy: number}
    | null
  >(null);
  const [draftRect, setDraftRect] = useState<{x: number; y: number; w: number; h: number} | null>(null);

  const active = metas.find((m) => m.id === activeId) ?? null;
  const pageFields = active ? active.fields.filter((f) => f.page === pageIdx) : [];
  const selectedField = active?.fields.find((f) => f.id === selectedFieldId) ?? null;

  // ---------- persistence ----------
  const persistMetas = (next: PdfTemplateMeta[]) => {
    setMetas(next);
    saveTemplateMetas(next);
  };

  // Load saved templates after mount (client-only, avoids SSR mismatch)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMetas(loadTemplateMetas());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const updateActive = (patch: Partial<PdfTemplateMeta>) => {
    if (!active) return;
    persistMetas(metas.map((m) => (m.id === active.id ? {...m, ...patch} : m)));
  };

  const updateField = (fieldId: string, patch: Partial<TemplateField>) => {
    if (!active) return;
    updateActive({
      fields: active.fields.map((f) => (f.id === fieldId ? {...f, ...patch} : f)),
    });
  };

  // ---------- open / upload ----------
  const openTemplate = async (meta: PdfTemplateMeta) => {
    setBusy(true);
    setStatus('টেমপ্লেট খোলা হচ্ছে...');
    try {
      const bytes = await loadPdfBytes(meta.id);
      if (!bytes) throw new Error('PDF ফাইলটা খুঁজে পাওয়া যায়নি (IndexedDB থেকে মুছে গেছে হয়তো)।');
      pdfBytesRef.current = bytes;
      const doc = await openPdf(bytes);
      setPdfDoc(doc);
      setActiveId(meta.id);
      setPageIdx(0);
      setSelectedFieldId(null);
      setMode('edit');
      try {
        const saved = localStorage.getItem(`pdf_template_values_${meta.id}`);
        setValues(saved ? JSON.parse(saved) : {});
      } catch {
        setValues({});
      }
      setStatus('');
    } catch (e) {
      setStatus(`⚠️ ${e instanceof Error ? e.message : 'টেমপ্লেট খুলতে সমস্যা হয়েছে'}`);
    } finally {
      setBusy(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setStatus('PDF পড়া হচ্ছে...');
    try {
      const bytes = await file.arrayBuffer();
      const doc = await openPdf(bytes);
      const first = await doc.getPage(1);
      const vp = first.getViewport({scale: 1});
      const meta: PdfTemplateMeta = {
        id: uid('tpl'),
        name: file.name.replace(/\.pdf$/i, ''),
        createdAt: nowMs(),
        pageCount: doc.numPages,
        pageWidth: vp.width,
        pageHeight: vp.height,
        fields: [],
      };
      await savePdfBytes(meta.id, bytes);
      const next = [meta, ...metas];
      persistMetas(next);
      await openTemplate(meta);
      setStatus(`✓ "${meta.name}" টেমপ্লেট তৈরি হয়েছে — এখন যেখানে তথ্য বসবে সেখানে টেনে বক্স আঁকুন।`);
    } catch {
      setStatus('⚠️ PDF-টা পড়া যায়নি। অন্য একটা PDF দিয়ে চেষ্টা করুন।');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteTemplate = async (meta: PdfTemplateMeta) => {
    if (!window.confirm(`"${meta.name}" টেমপ্লেট মুছে ফেলবেন?`)) return;
    await deletePdfBytes(meta.id);
    const next = metas.filter((m) => m.id !== meta.id);
    persistMetas(next);
    if (activeId === meta.id) {
      setActiveId(null);
      setPdfDoc(null);
      setPageView(null);
      pdfBytesRef.current = null;
    }
  };

  // ---------- page rendering ----------
  useEffect(() => {
    if (!pdfDoc) return;
    let cancelled = false;
    (async () => {
      const containerW = viewerRef.current?.clientWidth || 794;
      const targetW = Math.min(Math.max(containerW - 4, 300), 900);
      const rendered = await renderPage(pdfDoc, pageIdx + 1, targetW);
      if (cancelled) return;
      setPageView({
        dataUrl: rendered.canvas.toDataURL('image/png'),
        widthPt: rendered.widthPt,
        heightPt: rendered.heightPt,
        displayW: rendered.canvas.style.width ? parseFloat(rendered.canvas.style.width) : targetW,
        displayH: rendered.heightPt * rendered.scale,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [pdfDoc, pageIdx, activeId]);

  // ---------- field drawing / moving ----------
  const toPt = (e: React.PointerEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (!pageView) return {x: 0, y: 0};
    const scale = pageView.displayW / pageView.widthPt;
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  };

  const onOverlayPointerDown = (e: React.PointerEvent) => {
    if (mode !== 'edit' || !active || !pageView) return;
    const pt = toPt(e);
    dragRef.current = {kind: 'create', startX: pt.x, startY: pt.y};
    setDraftRect({x: pt.x, y: pt.y, w: 0, h: 0});
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onFieldPointerDown = (e: React.PointerEvent, field: TemplateField) => {
    if (mode !== 'edit' || !pageView) return;
    e.stopPropagation();
    setSelectedFieldId(field.id);
    const pt = toPt(e);
    dragRef.current = {kind: 'move', fieldId: field.id, dx: pt.x - field.x, dy: pt.y - field.y};
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onOverlayPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || !pageView || !active) return;
    const pt = toPt(e);
    if (drag.kind === 'create') {
      setDraftRect({
        x: Math.min(drag.startX, pt.x),
        y: Math.min(drag.startY, pt.y),
        w: Math.abs(pt.x - drag.startX),
        h: Math.abs(pt.y - drag.startY),
      });
    } else {
      const field = active.fields.find((f) => f.id === drag.fieldId);
      if (!field) return;
      updateField(field.id, {
        x: Math.max(0, Math.min(pt.x - drag.dx, pageView.widthPt - field.w)),
        y: Math.max(0, Math.min(pt.y - drag.dy, pageView.heightPt - field.h)),
      });
    }
  };

  const onOverlayPointerUp = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (drag?.kind === 'create' && draftRect && active) {
      if (draftRect.w >= 10 && draftRect.h >= 6) {
        const field: TemplateField = {
          id: uid('f'),
          name: `ফিল্ড ${active.fields.length + 1}`,
          page: pageIdx,
          x: Math.round(draftRect.x),
          y: Math.round(draftRect.y),
          w: Math.round(draftRect.w),
          h: Math.round(draftRect.h),
          fontSize: Math.max(7, Math.min(28, Math.round(draftRect.h * 0.62))),
          font: 'solaiman',
          color: '#000000',
          cover: true,
        };
        updateActive({fields: [...active.fields, field]});
        setSelectedFieldId(field.id);
      }
      setDraftRect(null);
    }
  };

  // ---------- fill values ----------
  const setValue = (fieldId: string, v: string) => {
    setValues((prev) => {
      const next = {...prev, [fieldId]: v};
      if (active) {
        try {
          localStorage.setItem(`pdf_template_values_${active.id}`, JSON.stringify(next));
        } catch {}
      }
      return next;
    });
  };

  const handleGenerate = async () => {
    if (!active || !pdfBytesRef.current) return;
    setBusy(true);
    setStatus('PDF তৈরি হচ্ছে...');
    try {
      const blob = await generateFromTemplate(pdfBytesRef.current, active.fields, values);
      downloadBlob(blob, `${active.name}-filled.pdf`);
      setStatus('✓ PDF ডাউনলোড হয়েছে!');
    } catch (err) {
      console.error(err);
      setStatus('⚠️ PDF তৈরি করতে সমস্যা হয়েছে।');
    } finally {
      setBusy(false);
    }
  };

  const displayScale = pageView ? pageView.displayW / pageView.widthPt : 1;

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex-1 w-full pb-24 lg:pb-6">
      {/* header row */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <MousePointer2 className="w-5 h-5 text-indigo-400" />
          PDF টেমপ্লেট ক্লোন
        </h2>
        <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold cursor-pointer transition-colors">
          <FileUp className="w-4 h-4" />
          নতুন PDF আপলোড
          <input type="file" accept="application/pdf" onChange={handleUpload} className="hidden" />
        </label>
        {active && (
          <>
            <div className="inline-flex rounded-xl border border-slate-700 overflow-hidden">
              <button
                onClick={() => setMode('edit')}
                className={`px-3 py-2 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 ${mode === 'edit' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
              >
                <PencilLine className="w-4 h-4" /> ফিল্ড বসান
              </button>
              <button
                onClick={() => setMode('fill')}
                className={`px-3 py-2 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 ${mode === 'fill' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
              >
                <Type className="w-4 h-4" /> তথ্য পূরণ
              </button>
            </div>
            <button
              onClick={handleGenerate}
              disabled={busy || active.fields.length === 0}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              <Download className="w-4 h-4" /> PDF তৈরি করুন
            </button>
          </>
        )}
      </div>

      {/* template chips */}
      {metas.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {metas.map((m) => (
            <div
              key={m.id}
              className={`group inline-flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-full border text-xs sm:text-sm font-medium cursor-pointer transition-colors ${
                m.id === activeId
                  ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-200'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
              onClick={() => openTemplate(m)}
            >
              <span className="max-w-[180px] truncate">{m.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                {m.pageCount} পেজ · {m.fields.length} ফিল্ড
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTemplate(m);
                }}
                className="p-1 rounded-full text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                title="টেমপ্লেট মুছুন"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {status && (
        <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-slate-200">
          {status}
        </div>
      )}

      {!active && (
        <div className="border border-dashed border-slate-700 rounded-2xl bg-[#0F172A] px-6 py-14 text-center">
          <FileUp className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
          <p className="text-white font-bold text-base sm:text-lg mb-1.5">যেকোনো PDF-এর হুবহু কপি বানান</p>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            একটা PDF আপলোড করুন — সেটাই টেমপ্লেট হয়ে যাবে। যেসব জায়গার তথ্য বদলাবে (নাম, নম্বর, তারিখ)
            সেখানে টেনে বক্স এঁকে ফিল্ড বানান, তারপর শুধু নতুন তথ্য লিখে একই চেহারার PDF তৈরি করুন।
            সব ডেটা আপনার ব্রাউজারেই থাকে।
          </p>
        </div>
      )}

      {active && (
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* page viewer */}
          <div className="flex-1 w-full min-w-0">
            <div className="flex items-center justify-between mb-2">
              <input
                value={active.name}
                onChange={(e) => updateActive({name: e.target.value})}
                className="bg-transparent text-white font-bold text-sm sm:text-base border-b border-transparent hover:border-slate-600 focus:border-indigo-500 outline-none px-1 py-0.5 max-w-[280px] w-full"
                title="টেমপ্লেটের নাম"
              />
              {active.pageCount > 1 && (
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <button
                    onClick={() => setPageIdx((p) => Math.max(0, p - 1))}
                    disabled={pageIdx === 0}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span>
                    পেজ {pageIdx + 1} / {active.pageCount}
                  </span>
                  <button
                    onClick={() => setPageIdx((p) => Math.min(active.pageCount - 1, p + 1))}
                    disabled={pageIdx === active.pageCount - 1}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div ref={viewerRef} className="w-full overflow-x-auto">
              {pageView ? (
                <div
                  className="relative bg-white rounded-md shadow-2xl mx-auto select-none touch-none"
                  style={{width: pageView.displayW, height: pageView.displayH}}
                  onPointerDown={onOverlayPointerDown}
                  onPointerMove={onOverlayPointerMove}
                  onPointerUp={onOverlayPointerUp}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pageView.dataUrl}
                    alt={`পেজ ${pageIdx + 1}`}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    draggable={false}
                  />
                  {/* field overlays */}
                  {pageFields.map((f) => {
                    const val = values[f.id] ?? '';
                    const fontClass = TEMPLATE_FONTS.find((t) => t.key === f.font)?.cssClass ?? '';
                    return (
                      <div
                        key={f.id}
                        onPointerDown={(e) => onFieldPointerDown(e, f)}
                        className={`absolute overflow-hidden ${
                          mode === 'edit'
                            ? `border ${selectedFieldId === f.id ? 'border-indigo-500 bg-indigo-500/15' : 'border-rose-500/70 bg-rose-500/10'} cursor-move`
                            : `${f.cover ? 'bg-white' : ''}`
                        }`}
                        style={{
                          left: f.x * displayScale,
                          top: f.y * displayScale,
                          width: f.w * displayScale,
                          height: f.h * displayScale,
                        }}
                        title={f.name}
                      >
                        {mode === 'edit' ? (
                          <span className="absolute top-0 left-0 text-[9px] font-bold px-1 bg-slate-900/80 text-white rounded-br pointer-events-none max-w-full truncate">
                            {f.name}
                          </span>
                        ) : (
                          val && (
                            <span
                              className={`${fontClass} block whitespace-nowrap leading-none`}
                              style={{
                                fontSize: f.fontSize * displayScale,
                                color: f.color,
                                paddingTop: Math.max(0, (f.h - f.fontSize) * displayScale * 0.35),
                              }}
                            >
                              {val}
                            </span>
                          )
                        )}
                      </div>
                    );
                  })}
                  {/* draft rect while drawing */}
                  {draftRect && (
                    <div
                      className="absolute border-2 border-dashed border-indigo-400 bg-indigo-400/10 pointer-events-none"
                      style={{
                        left: draftRect.x * displayScale,
                        top: draftRect.y * displayScale,
                        width: draftRect.w * displayScale,
                        height: draftRect.h * displayScale,
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                  {busy ? 'লোড হচ্ছে...' : 'পেজ রেন্ডার হচ্ছে...'}
                </div>
              )}
            </div>
            {mode === 'edit' && (
              <p className="text-[11px] text-slate-500 mt-2 text-center">
                পেজের উপর টেনে (drag) বক্স আঁকলেই নতুন ফিল্ড তৈরি হবে। ফিল্ড ধরে টেনে জায়গা বদলানো যায়।
              </p>
            )}
          </div>

          {/* right panel */}
          <div className="w-full lg:w-80 shrink-0 bg-[#0F172A] border border-slate-800 rounded-xl p-4">
            {mode === 'edit' ? (
              <>
                <h3 className="text-sm font-bold text-white mb-3">
                  এই পেজের ফিল্ড ({pageFields.length})
                </h3>
                {pageFields.length === 0 && (
                  <p className="text-xs text-slate-500 leading-relaxed">
                    এখনো কোনো ফিল্ড নেই। পেজের যেখানে নতুন তথ্য বসবে সেখানে টেনে বক্স আঁকুন।
                  </p>
                )}
                <div className="space-y-1.5 mb-4">
                  {pageFields.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFieldId(f.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        selectedFieldId === f.id
                          ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-100'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {f.name}
                      <span className="float-right text-slate-500 font-mono text-[10px]">
                        {Math.round(f.w)}×{Math.round(f.h)}pt
                      </span>
                    </button>
                  ))}
                </div>

                {selectedField && (
                  <div className="border-t border-slate-800 pt-3 space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">ফিল্ডের নাম</label>
                      <input
                        value={selectedField.name}
                        onChange={(e) => updateField(selectedField.id, {name: e.target.value})}
                        className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">ফন্ট</label>
                        <select
                          value={selectedField.font}
                          onChange={(e) => updateField(selectedField.id, {font: e.target.value as TemplateField['font']})}
                          className="w-full px-2 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        >
                          {TEMPLATE_FONTS.map((t) => (
                            <option key={t.key} value={t.key}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">সাইজ (pt)</label>
                        <input
                          type="number"
                          min={6}
                          max={40}
                          value={selectedField.fontSize}
                          onChange={(e) => updateField(selectedField.id, {fontSize: Number(e.target.value) || 10})}
                          className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">লেখার রঙ</label>
                      <div className="flex items-center gap-1.5">
                        {COLOR_PRESETS.map((c) => (
                          <button
                            key={c}
                            onClick={() => updateField(selectedField.id, {color: c})}
                            className={`w-6 h-6 rounded-md border ${selectedField.color === c ? 'border-indigo-400 ring-2 ring-indigo-500/40' : 'border-slate-600'}`}
                            style={{backgroundColor: c}}
                            title={c}
                          />
                        ))}
                        <input
                          type="color"
                          value={selectedField.color}
                          onChange={(e) => updateField(selectedField.id, {color: e.target.value})}
                          className="w-8 h-7 bg-transparent cursor-pointer"
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedField.cover}
                        onChange={(e) => updateField(selectedField.id, {cover: e.target.checked})}
                        className="accent-indigo-500"
                      />
                      <Eraser className="w-3.5 h-3.5 text-slate-400" />
                      পুরনো লেখা সাদা দিয়ে ঢেকে দাও
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">প্রস্থ (pt)</label>
                        <input
                          type="number"
                          value={Math.round(selectedField.w)}
                          onChange={(e) => updateField(selectedField.id, {w: Math.max(10, Number(e.target.value) || 10)})}
                          className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">উচ্চতা (pt)</label>
                        <input
                          type="number"
                          value={Math.round(selectedField.h)}
                          onChange={(e) => updateField(selectedField.id, {h: Math.max(6, Number(e.target.value) || 6)})}
                          className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        updateActive({fields: active.fields.filter((f) => f.id !== selectedField.id)});
                        setSelectedFieldId(null);
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-rose-600/15 border border-rose-500/30 text-rose-300 font-semibold hover:bg-rose-600/25 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> ফিল্ড মুছুন
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <h3 className="text-sm font-bold text-white mb-3">তথ্য পূরণ করুন</h3>
                {active.fields.length === 0 && (
                  <p className="text-xs text-slate-500 leading-relaxed">
                    আগে “ফিল্ড বসান” মোডে গিয়ে ফিল্ড তৈরি করুন।
                  </p>
                )}
                <div className="space-y-3">
                  {active.fields
                    .slice()
                    .sort((a, b) => a.page - b.page || a.y - b.y)
                    .map((f) => (
                      <div key={f.id}>
                        <label className="block text-slate-400 font-medium mb-1 text-xs">
                          {f.name}
                          {active.pageCount > 1 && (
                            <span className="text-slate-600"> · পেজ {f.page + 1}</span>
                          )}
                        </label>
                        <input
                          value={values[f.id] ?? ''}
                          onChange={(e) => setValue(f.id, e.target.value)}
                          onFocus={() => setPageIdx(f.page)}
                          className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                          placeholder="এখানে লিখুন..."
                        />
                      </div>
                    ))}
                </div>
                {active.fields.length > 0 && (
                  <button
                    onClick={handleGenerate}
                    disabled={busy}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-sm font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4" /> PDF তৈরি করুন
                  </button>
                )}
                <button
                  onClick={() => active.fields.forEach((f) => setValue(f.id, ''))}
                  className="mt-2 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 rotate-45" /> সব ঘর খালি করুন
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
