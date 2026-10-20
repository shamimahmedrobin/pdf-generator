'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ActiveOption, FormDataState, NidDataState, ProffDataState, GeneratedDocItem } from '@/types/single-page-types';
import { DEFAULT_FORM_DATA, DEFAULT_GENERATED_DOCS, DEFAULT_NID_DATA, DEFAULT_PROFF_DATA } from '@/lib/single-page-demos';
import { loadPersistedState, STORAGE_KEYS, writeLocal } from '@/lib/storage';
import { SinglePagePaperPreview } from '@/components/SinglePagePaperPreview';
import { generateAndDownloadPdf, triggerBrowserPrint } from '@/lib/pdf-generator';
import { toBanglaNumber } from '@/lib/utils';
import {
  FileText,
  CreditCard,
  Award,
  Download,
  Printer,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  Check,
  Eye,
  FileCheck2,
  BarChart2,
  X,
  Edit3,
  Menu,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function SinglePagePdfMaker() {
  // Three primary options: Form, Nid, Proff
  const [activeOption, setActiveOption] = useState<ActiveOption>('Form');

  // Form states for the 3 options
  const [formData, setFormData] = useState<FormDataState>(DEFAULT_FORM_DATA);
  const [nidData, setNidData] = useState<NidDataState>(DEFAULT_NID_DATA);
  const [proffData, setProffData] = useState<ProffDataState>(DEFAULT_PROFF_DATA);

  // Dashboard Generated Documents History
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedDocItem[]>(DEFAULT_GENERATED_DOCS);

  // Responsive UI state
  const [scale, setScale] = useState<number>(0.85);
  const [useSutonnyFont, setUseSutonnyFont] = useState<boolean>(true);
  const [selectedFont, setSelectedFont] = useState<'sutonny' | 'kalpurush' | 'solaiman' | 'hind'>('sutonny');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHistoryInMenu, setShowHistoryInMenu] = useState(false);
  const [activeTabMobile, setActiveTabMobile] = useState<'form' | 'preview'>('form');

  const previewOuterContainerRef = useRef<HTMLDivElement>(null);

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Safe client-side hydration from localStorage after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = loadPersistedState();
      if (saved.formData) setFormData(saved.formData);
      if (saved.nidData) setNidData(saved.nidData);
      if (saved.proffData) setProffData(saved.proffData);
      if (saved.generatedDocs) setGeneratedDocs(saved.generatedDocs);
      if (saved.selectedFont) setSelectedFont(saved.selectedFont);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Auto-fit function for any screen size (mobile, tablet, desktop)
  const fitToScreen = useCallback(() => {
    if (typeof window !== 'undefined') {
      const containerWidth = previewOuterContainerRef.current?.clientWidth || window.innerWidth;
      // Leave padding for container boundaries
      const availableWidth = Math.max(260, containerWidth - 32);
      const calculated = Math.min(1.05, Number((availableWidth / 794).toFixed(2)));
      setScale(calculated);
    }
  }, []);

  // Set initial scale on mount and update on window resize
  useEffect(() => {
    fitToScreen();
    const handleResize = () => {
      fitToScreen();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fitToScreen]);

  // When mobile tab switches to preview, auto fit
  useEffect(() => {
    if (activeTabMobile === 'preview') {
      setTimeout(() => fitToScreen(), 50);
    }
  }, [activeTabMobile, fitToScreen]);

  // Sync state to localStorage
  const saveFormData = (data: FormDataState) => {
    setFormData(data);
    writeLocal(STORAGE_KEYS.form, data);
  };

  const saveNidData = (data: NidDataState) => {
    setNidData(data);
    writeLocal(STORAGE_KEYS.nid, data);
  };

  const saveProffData = (data: ProffDataState) => {
    setProffData(data);
    writeLocal(STORAGE_KEYS.proff, data);
  };

  const saveHistory = (docs: GeneratedDocItem[]) => {
    setGeneratedDocs(docs);
    writeLocal(STORAGE_KEYS.history, docs);
  };

  // Photo upload for NID
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          saveNidData({ ...nidData, photoUrl: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Signature upload for NID
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          saveNidData({ ...nidData, signatureUrl: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };


  // Reset to default demo data
  const handleReset = () => {
    if (activeOption === 'Form') {
      saveFormData(DEFAULT_FORM_DATA);
    } else if (activeOption === 'Nid') {
      saveNidData(DEFAULT_NID_DATA);
    } else {
      saveProffData(DEFAULT_PROFF_DATA);
    }
    setStatusMessage('ডিফল্ট ডেমো তথ্যে রিসেট করা হয়েছে!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  // Correction row management for Form-2
  const handleAddCorrectionRow = () => {
    const newRow = {
      id: `row-${Date.now()}`,
      subject: '',
      currentData: '',
      correctedData: '',
      attachment: ''
    };
    saveFormData({
      ...formData,
      corrections: [...(formData.corrections || []), newRow]
    });
  };

  const handleUpdateCorrectionRow = (id: string, field: 'subject' | 'currentData' | 'correctedData' | 'attachment', value: string) => {
    const updated = formData.corrections.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    saveFormData({ ...formData, corrections: updated });
  };

  const handleRemoveCorrectionRow = (id: string) => {
    const updated = formData.corrections.filter((row) => row.id !== id);
    saveFormData({ ...formData, corrections: updated });
  };

  // Generate and Download PDF
  const handleGeneratePdf = async () => {
    setIsGenerating(true);
    setStatusMessage('পিডিএফ প্রস্তুত করা হচ্ছে...');

    // If on mobile and in form tab, activate preview tab first so DOM is visible
    if (activeTabMobile !== 'preview') {
      setActiveTabMobile('preview');
      for (let i = 0; i < 15; i++) {
        await new Promise((r) => setTimeout(r, 40));
        const el = document.getElementById('pdf-render-area');
        if (el && el.offsetHeight > 0) break;
      }
    }

    let fileName = 'correction_form.pdf';
    let docTitle = 'ডকুমেন্ট';
    let docNumber = 'DOC-001';

    if (activeOption === 'Form') {
      docTitle = 'ফরম-২ জাতীয় পরিচয়পত্র বা তথ্য-উপাত্ত সংশোধনের আবেদন';
      docNumber = formData.serialNo || 'NIDCA';
      fileName = 'correction_form.pdf';
    } else if (activeOption === 'Nid') {
      docTitle = `NID_${nidData.nameBangla || 'জাতীয়_পরিচয়পত্র'}`;
      docNumber = nidData.nidNumber || '1533151575';
      const cleanNid = (nidData.nidNumber || '1533151575').replace(/\s+/g, '');
      fileName = `NID_${cleanNid}.pdf`;
    } else {
      docTitle = proffData.subject || 'প্রত্যয়ন_পত্র';
      docNumber = proffData.refNo || 'PROFF';
      fileName = `Proff_Certificate_${Date.now()}.pdf`;
    }

    const success = await generateAndDownloadPdf({
      fileName,
      elementId: 'pdf-render-area',
      onProgress: (_prog, stage) => {
        setStatusMessage(stage);
      }
    });

    setIsGenerating(false);

    if (success) {
      const newHistoryItem: GeneratedDocItem = {
        id: `doc-${Date.now()}`,
        type: activeOption,
        title: docTitle,
        docNumber,
        createdAt: new Date().toLocaleDateString('bn-BD'),
        downloadCount: 1
      };
      saveHistory([newHistoryItem, ...generatedDocs]);

      setStatusMessage(`✓ ${fileName} সফলভাবে ডাউনলোড সম্পন্ন হয়েছে!`);
      setTimeout(() => setStatusMessage(''), 5000);
    } else {
      setStatusMessage('⚠️ পিডিএফ তৈরিতে সমস্যা হয়েছে। দয়া করে পুনরায় চেষ্টা করুন।');
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  // Direct Re-download from dashboard
  const handleReDownload = async (item: GeneratedDocItem) => {
    setActiveOption(item.type);
    setStatusMessage(`${item.title} পুনরায় প্রস্তুত করা হচ্ছে...`);
    setTimeout(async () => {
      const downloadName = item.type === 'Form' ? 'correction_form.pdf' : `${item.type || 'Document'}_${Date.now()}.pdf`;
      await generateAndDownloadPdf({
        fileName: downloadName,
        elementId: 'pdf-render-area'
      });
      const updated = generatedDocs.map((d) =>
        d.id === item.id ? { ...d, downloadCount: d.downloadCount + 1 } : d
      );
      saveHistory(updated);
      setStatusMessage(`✓ ${downloadName} ডাউনলোড সম্পন্ন হয়েছে!`);
      setTimeout(() => setStatusMessage(''), 4000);
    }, 400);
  };

  const handleDeleteHistory = (id: string) => {
    saveHistory(generatedDocs.filter((d) => d.id !== id));
  };

  const totalDownloads = generatedDocs.reduce((acc, curr) => acc + (curr.downloadCount || 0), 0);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Mark & Active Mode Tag */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileCheck2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base md:text-lg font-bold text-white tracking-tight">
                সহজPDF মেকার
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {activeOption === 'Form' && 'Form (আবেদন)'}
                {activeOption === 'Nid' && 'NiD (আইডি কার্ড)'}
                {activeOption === 'Proff' && 'Proff (প্রত্যয়ন)'}
              </span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* MENU BUTTON (Contains Form, NiD, Proff) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`relative inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all duration-200 shadow-sm cursor-pointer ${
                isMenuOpen
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-500/30'
                  : 'text-slate-200 bg-slate-900 border-slate-700/80 hover:bg-slate-800 hover:border-indigo-500/50 hover:text-white'
              }`}
              title="মেনু খুলুন (Form, NiD, Proff)"
              aria-label="Menu"
            >
              <div className={`p-1 rounded-md transition-colors ${isMenuOpen ? 'bg-white/20 text-white' : 'bg-indigo-500/10 text-indigo-400'}`}>
                <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="font-bold tracking-wide">Menu</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {activeOption === 'Nid' ? 'NiD' : activeOption}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isMenuOpen ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ================= STATUS BANNER ================= */}
      {statusMessage && (
        <div
          className={`border-b text-xs py-2 px-3 text-center flex items-center justify-center gap-2 animate-in fade-in transition-all ${
            statusMessage.includes('⚠️')
              ? 'bg-rose-950/95 border-rose-800 text-rose-200'
              : statusMessage.includes('✓')
              ? 'bg-emerald-950/95 border-emerald-700 text-emerald-200'
              : 'bg-indigo-950/95 border-indigo-700 text-indigo-200'
          }`}
        >
          {statusMessage.includes('✓') ? (
            <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
          ) : statusMessage.includes('⚠️') ? (
            <X className="w-3.5 h-3.5 shrink-0 text-rose-400" />
          ) : (
            <div className="w-3 h-3 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin shrink-0" />
          )}
          <span>{statusMessage}</span>
        </div>
      )}

      {/* ================= BEAUTIFUL MENU BACKDROP & PANEL ================= */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 bg-black/60 backdrop-blur-sm z-30 transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Drawer / Panel */}
          <div className="relative z-40 bg-gradient-to-b from-[#0F172A] via-[#0B1120] to-[#090D16] border-b border-slate-800/90 shadow-2xl shadow-black/80 animate-in slide-in-from-top-3 duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-5">
              {/* Menu Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-sm">
                    <Menu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        ডকুমেন্ট মেনু
                      </h2>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/25">
                        Document Menu
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      আপনার পছন্দের অপশনটি নির্বাচন করুন: Form, NiD অথবা Proff
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all cursor-pointer"
                    title="মেনু বন্ধ করুন"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* The 3 Core Options: Form, NiD, Proff */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
                {/* Option 1: Form */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveOption('Form');
                    setIsMenuOpen(false);
                    setStatusMessage('Form (ফরম-২) অপশন নির্বাচন করা হয়েছে');
                    setTimeout(() => setStatusMessage(''), 2500);
                  }}
                  className={`group relative p-4 sm:p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                    activeOption === 'Form'
                      ? 'bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-950/60'
                      : 'bg-slate-900/70 border-slate-800/90 hover:border-indigo-500/60 hover:bg-slate-850 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 group-hover:bg-indigo-500/25 transition-all">
                        <FileText className="w-5 h-5" />
                      </div>
                      {activeOption === 'Form' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-600/40 px-2.5 py-0.5 rounded-full shadow-sm">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> সক্রিয়
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-400 bg-slate-800/70 px-2 py-0.5 rounded-full border border-slate-700/60">
                          ফরম-২
                        </span>
                      )}
                    </div>

                    <div className="mt-3.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                          Form
                        </h3>
                        <span className="text-xs text-indigo-400/90 font-mono">(আবেদন ফরম)</span>
                      </div>
                      <div className="text-xs font-semibold text-indigo-300 mt-0.5">
                        ফরম-২: জাতীয় পরিচয়পত্র তথ্য সংশোধন
                      </div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        নাম, বয়স বা পিতা-মাতার ভুল সংশোধন, তথ্যাবলির পরিবর্তন, সংযুক্তি ও চালান রসিদ ফরম।
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                    <span className={activeOption === 'Form' ? 'text-indigo-300 font-bold' : 'text-slate-400 group-hover:text-indigo-300'}>
                      {activeOption === 'Form' ? '✓ বর্তমানে নির্বাচিত' : 'সিলেক্ট করুন'}
                    </span>
                    <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${activeOption === 'Form' ? 'text-indigo-400' : 'text-slate-500'}`} />
                  </div>
                </button>

                {/* Option 2: NiD */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveOption('Nid');
                    setIsMenuOpen(false);
                    setStatusMessage('NiD (জাতীয় পরিচয়পত্র) অপশন নির্বাচন করা হয়েছে');
                    setTimeout(() => setStatusMessage(''), 2500);
                  }}
                  className={`group relative p-4 sm:p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                    activeOption === 'Nid'
                      ? 'bg-gradient-to-br from-emerald-950/70 via-slate-900/90 to-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-950/60'
                      : 'bg-slate-900/70 border-slate-800/90 hover:border-emerald-500/60 hover:bg-slate-850 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 group-hover:bg-emerald-500/25 transition-all">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      {activeOption === 'Nid' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-600/40 px-2.5 py-0.5 rounded-full shadow-sm">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> সক্রিয়
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-400 bg-slate-800/70 px-2 py-0.5 rounded-full border border-slate-700/60">
                          আইডি কার্ড
                        </span>
                      )}
                    </div>

                    <div className="mt-3.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                          NiD
                        </h3>
                        <span className="text-xs text-emerald-400/90 font-mono">(স্মার্ট/ল্যামিনেটিং)</span>
                      </div>
                      <div className="text-xs font-semibold text-emerald-300 mt-0.5">
                        জাতীয় পরিচয়পত্র: উভয় পাশ (Front & Back)
                      </div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        আসল Nikosh ও SutonnyMJ ফন্ট, নির্ভুল জলছাপ এবং উভয় পাশের আদর্শ স্ট্যান্ডার্ড প্রিন্ট লেআউট।
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                    <span className={activeOption === 'Nid' ? 'text-emerald-300 font-bold' : 'text-slate-400 group-hover:text-emerald-300'}>
                      {activeOption === 'Nid' ? '✓ বর্তমানে নির্বাচিত' : 'সিলেক্ট করুন'}
                    </span>
                    <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${activeOption === 'Nid' ? 'text-emerald-400' : 'text-slate-500'}`} />
                  </div>
                </button>

                {/* Option 3: Proff */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveOption('Proff');
                    setIsMenuOpen(false);
                    setStatusMessage('Proff (প্রত্যয়ন পত্র) অপশন নির্বাচন করা হয়েছে');
                    setTimeout(() => setStatusMessage(''), 2500);
                  }}
                  className={`group relative p-4 sm:p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                    activeOption === 'Proff'
                      ? 'bg-gradient-to-br from-amber-950/70 via-slate-900/90 to-amber-950/40 border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-950/60'
                      : 'bg-slate-900/70 border-slate-800/90 hover:border-amber-500/60 hover:bg-slate-850 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 group-hover:bg-amber-500/25 transition-all">
                        <Award className="w-5 h-5" />
                      </div>
                      {activeOption === 'Proff' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-600/40 px-2.5 py-0.5 rounded-full shadow-sm">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> সক্রিয়
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-400 bg-slate-800/70 px-2 py-0.5 rounded-full border border-slate-700/60">
                          প্রত্যয়ন পত্র
                        </span>
                      )}
                    </div>

                    <div className="mt-3.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                          Proff
                        </h3>
                        <span className="text-xs text-amber-400/90 font-mono">(নাগরিকত্ব সনদ)</span>
                      </div>
                      <div className="text-xs font-semibold text-amber-300 mt-0.5">
                        স্থায়ী নাগরিকত্ব ও চারিত্রিক প্রত্যয়ন পত্র
                      </div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        সিটি কর্পোরেশন বা ইউনিয়ন পরিষদের প্যাডে স্মারক নং, সিল ও চেয়ারম্যানের স্বাক্ষরিত নাগরিকত্ব সনদ।
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                    <span className={activeOption === 'Proff' ? 'text-amber-300 font-bold' : 'text-slate-400 group-hover:text-amber-300'}>
                      {activeOption === 'Proff' ? '✓ বর্তমানে নির্বাচিত' : 'সিলেক্ট করুন'}
                    </span>
                    <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${activeOption === 'Proff' ? 'text-amber-400' : 'text-slate-500'}`} />
                  </div>
                </button>
              </div>

              {/* Menu Bottom Bar: Quick actions & Collapsible History */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="flex items-center gap-1.5 text-indigo-300 font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    সহজ সিলেকশন:
                  </span>
                  <span className="text-slate-300">
                    বর্তমান মোড: <strong className="text-emerald-400 font-bold">{activeOption === 'Nid' ? 'NiD' : activeOption}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowHistoryInMenu(!showHistoryInMenu)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/80 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>সংরক্ষিত ডকুমেন্টস ({generatedDocs.length})</span>
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showHistoryInMenu ? 'rotate-180' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleReset();
                      setIsMenuOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-750 text-rose-300 hover:text-rose-200 border border-slate-700/80 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="ডিফল্ট তথ্যে রিসেট করুন"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>রিসেট</span>
                  </button>
                </div>
              </div>

              {/* Collapsible History Section inside Menu */}
              {showHistoryInMenu && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5">
                      <span className="text-[10px] text-slate-400 block">মোট তৈরি ডকুমেন্টস</span>
                      <span className="text-lg font-bold text-white font-mono">{generatedDocs.length}</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5">
                      <span className="text-[10px] text-slate-400 block">মোট ডাউনলোড সংখ্যা</span>
                      <span className="text-lg font-bold text-emerald-400 font-mono">{totalDownloads}</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto shadow-sm max-h-56 overflow-y-auto">
                    <table className="w-full text-xs text-left text-slate-300 min-w-[480px]">
                      <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800 sticky top-0">
                        <tr>
                          <th className="py-2 px-3">ডকুমেন্ট ও আইডি</th>
                          <th className="py-2 px-3">ধরন</th>
                          <th className="py-2 px-3">তারিখ</th>
                          <th className="py-2 px-3 text-center">ডাউনলোড</th>
                          <th className="py-2 px-3 text-right">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {generatedDocs.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-850">
                            <td className="py-2 px-3 font-semibold text-white">
                              <div className="truncate max-w-[180px]">{item.title}</div>
                              <span className="text-[10px] text-slate-500 font-mono">{item.docNumber}</span>
                            </td>
                            <td className="py-2 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  item.type === 'Form'
                                    ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                                    : item.type === 'Nid'
                                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                                }`}
                              >
                                {item.type}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-slate-400 font-mono text-[10px] whitespace-nowrap">
                              {item.createdAt}
                            </td>
                            <td className="py-2 px-3 text-center font-mono">{item.downloadCount}</td>
                            <td className="py-2 px-3 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleReDownload(item)}
                                  className="px-2 py-0.5 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 rounded flex items-center gap-1 cursor-pointer"
                                  title="পুনরায় ডাউনলোড"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>ডাউনলোড</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteHistory(item.id)}
                                  className="p-1 text-rose-400 hover:text-rose-300 rounded hover:bg-slate-800 cursor-pointer"
                                  title="মুছে ফেলুন"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}


      {/* ================= MAIN WORKSPACE ================= */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex-1 w-full space-y-4 pb-24 lg:pb-6">

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ================= LEFT COLUMN: FORM INPUTS ================= */}
          <div
            className={`lg:col-span-5 space-y-4 ${
              activeTabMobile === 'form' ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Mode Title & Reset Action */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="text-sm font-bold text-white">
                  {activeOption === 'Form' && 'ফরম-২: আবেদন ও তথ্য এডিটর'}
                  {activeOption === 'Nid' && 'জাতীয় পরিচয়পত্র (NID) এডিটর'}
                  {activeOption === 'Proff' && 'প্রত্যয়ন ও নাগরিকত্ব সনদ এডিটর'}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-amber-300 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="ডিফল্ট তথ্যে ফিরে যান"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>রিসেট</span>
              </button>
            </div>

            {/* FORM OPTION FIELDS (FORM-2: NID AMENDMENT APPLICATION) */}
            {activeOption === 'Form' && (
              <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-3.5 sm:p-4 space-y-4 text-xs">
                {/* Header Information */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">
                      ফরম-২ (জাতীয় পরিচয়পত্র বা তথ্য-উপাত্ত সংশোধনের আবেদন)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">[প্রবিধান ৪]</span>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">
                      ক্রমিক নম্বর (Tracking / Serial No.)
                    </label>
                    <input
                      type="text"
                      value={formData.serialNo}
                      onChange={(e) => saveFormData({ ...formData, serialNo: e.target.value })}
                      placeholder="যেমন: NIDCA5002923842"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono font-bold tracking-wider"
                    />
                  </div>
                </div>

                {/* Section 1: Applicant Particulars */}
                <div className="space-y-2 pt-1 border-t border-slate-800">
                  <h3 className="font-bold text-indigo-300 text-xs">
                    ১। জাতীয় পরিচয়পত্রধারীর তথ্য:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">(ক) নাম</label>
                      <input
                        type="text"
                        value={formData.applicantName}
                        onChange={(e) => saveFormData({ ...formData, applicantName: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                        placeholder="মোঃ রবিউল্লাহ"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">
                        (খ) জাতীয় পরিচিতি নম্বর (NID)
                      </label>
                      <input
                        type="text"
                        value={formData.applicantNid}
                        onChange={(e) => saveFormData({ ...formData, applicantNid: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono font-bold text-rose-400"
                        placeholder="8732934032"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Guardian Particulars (Optional) */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <h3 className="font-bold text-slate-300 text-xs">
                    ২। আইনানুগ অভিভাবকের তথ্য (প্রযোজ্য ক্ষেত্রে):
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">(ক) অভিভাবকের নাম</label>
                      <input
                        type="text"
                        value={formData.guardianName || ''}
                        onChange={(e) => saveFormData({ ...formData, guardianName: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                        placeholder="প্রযোজ্য ক্ষেত্রে লিখুন"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">
                        (খ) জাতীয় পরিচিতি নম্বর (NID)
                      </label>
                      <input
                        type="text"
                        value={formData.guardianNid || ''}
                        onChange={(e) => saveFormData({ ...formData, guardianNid: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono font-bold"
                        placeholder="অভিভাবকের NID নম্বর"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Corrections Table Items */}
                <div className="space-y-2.5 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-indigo-300 text-xs">
                      ৩। যে তথ্য সংশোধন করিতে হইবে:
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddCorrectionRow}
                      className="px-2.5 py-1 text-[11px] font-semibold text-indigo-300 bg-indigo-950 border border-indigo-700/60 rounded-lg hover:bg-indigo-900 transition-colors"
                    >
                      + নতুন সারি যোগ
                    </button>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {formData.corrections?.map((row, idx) => {
                      const hasCorrectionData = Boolean(
                        (row.currentData && row.currentData.trim() !== '') ||
                        (row.correctedData && row.correctedData.trim() !== '')
                      );

                      let serialIdx = 0;
                      if (hasCorrectionData) {
                        for (let i = 0; i <= idx; i++) {
                          const r = formData.corrections[i];
                          if (
                            (r.currentData && r.currentData.trim() !== '') ||
                            (r.correctedData && r.correctedData.trim() !== '')
                          ) {
                            serialIdx++;
                          }
                        }
                      }
                      const bnSerial = serialIdx > 0 ? toBanglaNumber(serialIdx) : null;

                      return (
                        <div
                          key={row.id}
                          className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-400 font-mono">সারি #{idx + 1}</span>
                              {hasCorrectionData ? (
                                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 rounded">
                                  সংশোধন ক্রমিক: ({bnSerial})
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-950/40 text-amber-300/90 border border-amber-800/40 rounded">
                                  {row.attachment?.trim() ? 'শুধুমাত্র সংযুক্ত দলিল (ক্রমিক নেই)' : 'বিদ্যমান/চাহিত তথ্য দিলে ক্রমিক হবে'}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveCorrectionRow(row.id)}
                              className="text-rose-400 hover:text-rose-300 p-1"
                              title="মুছুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] text-slate-400">বিষয়</span>
                              <input
                                type="text"
                                value={row.subject}
                                onChange={(e) => handleUpdateCorrectionRow(row.id, 'subject', e.target.value)}
                                placeholder="যেমন: জন্ম তারিখ বা নাম"
                                className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-white text-[11px]"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400">সংযুক্ত দলিল/মন্তব্য</span>
                              <input
                                type="text"
                                value={row.attachment}
                                onChange={(e) => handleUpdateCorrectionRow(row.id, 'attachment', e.target.value)}
                                placeholder="BIRTH_CERTIFICATE / PASSPORT"
                                className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-white font-mono text-[11px]"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] text-slate-400">বর্তমানে বিদ্যমান তথ্য</span>
                              <input
                                type="text"
                                value={row.currentData}
                                onChange={(e) => handleUpdateCorrectionRow(row.id, 'currentData', e.target.value)}
                                placeholder="২৫/০৪/১৯৯৪"
                                className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-white font-mono text-[11px]"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400">চাহিত সংশোধিত তথ্য</span>
                              <input
                                type="text"
                                value={row.correctedData}
                                onChange={(e) => handleUpdateCorrectionRow(row.id, 'correctedData', e.target.value)}
                                placeholder="২৫/০৩/১৯৯৪"
                                className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-white font-mono text-[11px]"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section: Part B Dates */}
                <div className="space-y-2.5 pt-2 border-t border-slate-800 bg-slate-900/60 p-3 rounded-lg">
                  <h3 className="font-bold text-white text-xs">
                    অংশ - খ (রসিদের তারিখ ও ডেলিভারি বিবরণ):
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">আবেদনের তারিখ</label>
                      <input
                        type="text"
                        value={formData.applicationDate}
                        onChange={(e) => saveFormData({ ...formData, applicationDate: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono font-bold"
                        placeholder="০৭/১০/২০২৬"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">
                        পরবর্তী যোগাযোগ / প্রদানের তারিখ
                      </label>
                      <input
                        type="text"
                        value={formData.deliveryDate}
                        onChange={(e) => saveFormData({ ...formData, deliveryDate: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono font-bold"
                        placeholder="১৫/১১/২০২৬"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NID OPTION FIELDS */}
            {activeOption === 'Nid' && (
              <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-3.5 sm:p-4 space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">নাম (বাংলায়)</label>
                    <input
                      type="text"
                      value={nidData.nameBangla}
                      onChange={(e) => saveNidData({ ...nidData, nameBangla: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Name (English)</label>
                    <input
                      type="text"
                      value={nidData.nameEnglish}
                      onChange={(e) => saveNidData({ ...nidData, nameEnglish: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white uppercase font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">পিতা (Father&apos;s Name)</label>
                    <input
                      type="text"
                      value={nidData.fatherName}
                      onChange={(e) => saveNidData({ ...nidData, fatherName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">মাতা (Mother&apos;s Name)</label>
                    <input
                      type="text"
                      value={nidData.motherName}
                      onChange={(e) => saveNidData({ ...nidData, motherName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 font-medium mb-1">জাতীয় পরিচয়পত্র নম্বর (ID NO)</label>
                    <input
                      type="text"
                      value={nidData.nidNumber}
                      onChange={(e) => saveNidData({ ...nidData, nidNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono font-bold text-rose-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">রক্তের গ্রুপ</label>
                    <input
                      type="text"
                      value={nidData.bloodGroup}
                      onChange={(e) => saveNidData({ ...nidData, bloodGroup: e.target.value })}
                      className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono font-bold text-center"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">জন্ম তারিখ (Date of Birth)</label>
                    <input
                      type="text"
                      value={nidData.dob}
                      onChange={(e) => saveNidData({ ...nidData, dob: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">জন্মস্থান (Birth Place)</label>
                    <input
                      type="text"
                      value={nidData.birthPlace}
                      onChange={(e) => saveNidData({ ...nidData, birthPlace: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">ঠিকানা (Address - ব্যাক সাইড)</label>
                  <textarea
                    rows={2}
                    value={nidData.address}
                    onChange={(e) => saveNidData({ ...nidData, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">PIN কোড (বারকোড ডাটা)</label>
                    <input
                      type="text"
                      value={nidData.pinNumber || ''}
                      onChange={(e) => saveNidData({ ...nidData, pinNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">ইস্যুর তারিখ</label>
                    <input
                      type="text"
                      value={nidData.issueDate}
                      onChange={(e) => saveNidData({ ...nidData, issueDate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>

                {/* Photo & Signature Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">ছবি (Photo)</label>
                    <div className="flex items-center gap-2.5">
                      {nidData.photoUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={nidData.photoUrl} alt="NID" className="w-9 h-11 object-cover rounded border border-slate-700 shrink-0" />
                      )}
                      <label className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-center cursor-pointer hover:border-slate-500 transition-colors">
                        {nidData.photoUrl ? 'ছবি বদলান' : 'ছবি আপলোড করুন'}
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      </label>
                      {nidData.photoUrl && (
                        <button type="button" onClick={() => saveNidData({ ...nidData, photoUrl: '' })} className="px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-rose-400 hover:border-rose-500/50 transition-colors">মুছুন</button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">স্বাক্ষর (Signature)</label>
                    <div className="flex items-center gap-2.5">
                      {nidData.signatureUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={nidData.signatureUrl} alt="Signature" className="h-9 w-16 object-contain bg-white rounded border border-slate-700 shrink-0" />
                      )}
                      <label className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-center cursor-pointer hover:border-slate-500 transition-colors">
                        {nidData.signatureUrl ? 'স্বাক্ষর বদলান' : 'স্বাক্ষর আপলোড করুন'}
                        <input type="file" accept="image/*" onChange={handleSignatureUpload} className="hidden" />
                      </label>
                      {nidData.signatureUrl && (
                        <button type="button" onClick={() => saveNidData({ ...nidData, signatureUrl: '' })} className="px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-rose-400 hover:border-rose-500/50 transition-colors">মুছুন</button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Watermark Opacity Control */}
                <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <label className="block text-slate-300 font-medium text-xs">জলছাপ অপাসিটি (Watermark Opacity)</label>
                    <span className="text-[10px] text-slate-500">জাতীয় প্রতীকের স্বচ্ছতা নিয়ন্ত্রণ (ডিফল্ট ১২%)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="range"
                      min="0.04"
                      max="0.35"
                      step="0.01"
                      value={nidData.watermarkOpacity ?? 0.12}
                      onChange={(e) => saveNidData({ ...nidData, watermarkOpacity: parseFloat(e.target.value) })}
                      className="w-28 accent-amber-500 cursor-pointer"
                    />
                    <span className="text-amber-400 font-mono font-bold text-xs w-10 text-right">
                      {Math.round((nidData.watermarkOpacity ?? 0.12) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* PROFF OPTION FIELDS */}
            {activeOption === 'Proff' && (
              <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-3.5 sm:p-4 space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">ইস্যুকারী প্রতিষ্ঠান / অফিসের নাম</label>
                  <input
                    type="text"
                    value={proffData.instituteName}
                    onChange={(e) => saveProffData({ ...proffData, instituteName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">স্মারক নম্বর (Ref No)</label>
                    <input
                      type="text"
                      value={proffData.refNo}
                      onChange={(e) => saveProffData({ ...proffData, refNo: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">তারিখ</label>
                    <input
                      type="text"
                      value={proffData.date}
                      onChange={(e) => saveProffData({ ...proffData, date: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">প্রত্যয়নের বিষয় (Subject)</label>
                  <input
                    type="text"
                    value={proffData.subject}
                    onChange={(e) => saveProffData({ ...proffData, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">প্রত্যয়ন প্রাপকের নাম</label>
                    <input
                      type="text"
                      value={proffData.personName}
                      onChange={(e) => saveProffData({ ...proffData, personName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">পিতার নাম</label>
                    <input
                      type="text"
                      value={proffData.relationFather}
                      onChange={(e) => saveProffData({ ...proffData, relationFather: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">মাতার নাম</label>
                    <input
                      type="text"
                      value={proffData.relationMother}
                      onChange={(e) => saveProffData({ ...proffData, relationMother: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">ঠিকানা</label>
                    <input
                      type="text"
                      value={proffData.address}
                      onChange={(e) => saveProffData({ ...proffData, address: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">প্রত্যয়ন পত্রের মূল বিবরণ (Statement)</label>
                  <textarea
                    rows={4}
                    value={proffData.proofStatement}
                    onChange={(e) => saveProffData({ ...proffData, proofStatement: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">স্বাক্ষরকারী কর্মকর্তার নাম</label>
                    <input
                      type="text"
                      value={proffData.authorityName}
                      onChange={(e) => saveProffData({ ...proffData, authorityName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">পদবী ও দপ্তর</label>
                    <input
                      type="text"
                      value={proffData.authorityDesignation}
                      onChange={(e) => saveProffData({ ...proffData, authorityDesignation: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">অফিসিয়াল সিল টেক্সট</label>
                  <input
                    type="text"
                    value={proffData.sealText}
                    onChange={(e) => saveProffData({ ...proffData, sealText: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ================= RIGHT COLUMN: RESPONSIVE LIVE PREVIEW ================= */}
          <div
            className={`lg:col-span-7 space-y-4 ${
              activeTabMobile === 'preview'
                ? 'block'
                : 'max-lg:opacity-0 max-lg:pointer-events-none max-lg:fixed max-lg:-left-[9999px] max-lg:top-0 lg:block'
            }`}
          >
            {/* Top Toolbar: Zoom controls & Primary Generate Action */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2.5 lg:sticky lg:top-20 z-20 shadow-md">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setScale((s) => Math.max(0.3, Number((s - 0.1).toFixed(2))))}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  title="ছোট করুন"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-mono px-1.5 text-slate-300">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setScale((s) => Math.min(1.4, Number((s + 0.1).toFixed(2))))}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  title="বড় করুন"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={fitToScreen}
                  className="px-2 py-1 text-slate-300 hover:text-white rounded hover:bg-slate-800 transition-colors text-xs font-medium flex items-center gap-1"
                  title="স্ক্রিনের সাথে ফিট করুন"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span className="hidden sm:inline">ফিট</span>
                </button>
              </div>

              {/* Font Selection Dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1">
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">ফন্ট:</span>
                <select
                  value={selectedFont}
                  onChange={(e) => {
                    const val = e.target.value as 'sutonny' | 'kalpurush' | 'solaiman' | 'hind';
                    setSelectedFont(val);
                    setUseSutonnyFont(val === 'sutonny');
                    try {
                      localStorage.setItem('pdf_selected_font', val);
                    } catch {}
                  }}
                  className="bg-transparent text-xs font-semibold text-emerald-400 focus:outline-none cursor-pointer pr-1"
                  title="প্রিভিউ ও ডাউনলোডের বাংলা ফন্ট নির্বাচন"
                >
                  <option value="sutonny" className="bg-slate-900 text-slate-200">
                    সুতোনালী এমজে / নিকশ (Sutonny MJ)
                  </option>
                  <option value="kalpurush" className="bg-slate-900 text-slate-200">
                    কালপুরুষ (Kalpurush)
                  </option>
                  <option value="solaiman" className="bg-slate-900 text-slate-200">
                    সোলাইমান লিপি (SolaimanLipi)
                  </option>
                  <option value="hind" className="bg-slate-900 text-slate-200">
                    হিন্দ শিলিগুড়ি (Hind Siliguri)
                  </option>
                </select>
              </div>

              {/* Actions: Print and Primary Generate Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={triggerBrowserPrint}
                  className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
                  title="সরাসরি প্রিন্ট করুন"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">প্রিন্ট</span>
                </button>

                <button
                  type="button"
                  onClick={handleGeneratePdf}
                  disabled={isGenerating}
                  className="px-3.5 sm:px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>তৈরি হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 shrink-0" />
                      <span className="hidden xs:inline">পিডিএফ জেনারেট ও ডাউনলোড</span>
                      <span className="xs:hidden">ডাউনলোড</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* A4 Canvas Outer Container: dynamically responsive & centered */}
            <div
              ref={previewOuterContainerRef}
              className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 sm:p-6 overflow-x-auto min-h-[480px] sm:min-h-[750px] flex justify-center items-start shadow-inner"
            >
              {/* Scaled wrapper box: dynamically sized so no invisible horizontal overflow occurs */}
              <div
                style={{
                  width: `${Math.round(794 * scale)}px`,
                  height: `${Math.round(1123 * scale)}px`,
                  position: 'relative'
                }}
                className="mx-auto shrink-0 transition-all duration-150"
              >
                <div
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: '794px',
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                >
                  <SinglePagePaperPreview
                    activeOption={activeOption}
                    formData={formData}
                    nidData={nidData}
                    proffData={proffData}
                    useSutonnyFont={useSutonnyFont}
                    selectedFont={selectedFont}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ================= FLOATING BOTTOM NAVIGATION DOCK (MOBILE THUMB-FRIENDLY) ================= */}
      <div className="lg:hidden fixed bottom-4 inset-x-0 mx-auto w-fit z-40 px-3 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 bg-[#0F172A]/95 backdrop-blur-xl border border-indigo-500/40 rounded-full shadow-2xl shadow-black/90 ring-1 ring-white/10">
          <button
            type="button"
            onClick={() => {
              setActiveTabMobile('form');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTabMobile === 'form'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 ring-1 ring-indigo-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>তথ্য পূরণ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTabMobile('preview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTabMobile === 'preview'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 ring-1 ring-indigo-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>লাইভ প্রিভিউ</span>
          </button>

          <button
            type="button"
            onClick={handleGeneratePdf}
            disabled={isGenerating}
            className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
            title="পিডিএফ ডাউনলোড করুন"
          >
            {isGenerating ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>ডাউনলোড</span>
          </button>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-800/80 bg-[#0A0D14] py-4 sm:py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <p>সহজPDF মেকার · Form, Nid ও Proff সিঙ্গেল পেজ স্টুডিও</p>
          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span>১০০% রেসপনসিভ</span>
            <span>·</span>
            <span>A4 প্রিন্ট প্রস্তুত</span>
            <span>·</span>
            <span>ইনস্ট্যান্ট ডাউনলোড</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
