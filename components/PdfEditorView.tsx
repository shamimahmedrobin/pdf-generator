'use client';

import React, { useState } from 'react';
import { DocumentData, DemoTemplate, InvoiceItem } from '@/types/pdf';
import { PdfPaperPreview } from '@/components/PdfPaperPreview';
import { generateAndDownloadPdf, triggerBrowserPrint } from '@/lib/pdf-generator';
import { COLOR_PRESETS } from '@/lib/demo-templates';
import {
  Download,
  Printer,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  AlertCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon
} from 'lucide-react';

interface PdfEditorViewProps {
  currentDoc: DocumentData;
  onChangeDoc: (updated: DocumentData) => void;
  availableTemplates: DemoTemplate[];
  onSwitchTemplate: (templateId: string) => void;
  onSaveToHistory: (doc: DocumentData) => void;
  onResetToDemo: () => void;
  lang: 'bn' | 'en';
}

export const PdfEditorView: React.FC<PdfEditorViewProps> = ({
  currentDoc,
  onChangeDoc,
  availableTemplates,
  onSwitchTemplate,
  onSaveToHistory,
  onResetToDemo,
  lang
}) => {
  const [scale, setScale] = useState<number>(0.85);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStage, setGenerationStage] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [activeTabMobile, setActiveTabMobile] = useState<'form' | 'preview'>('form');

  // Accordion section states for organized clean UI
  const [openSections, setOpenSections] = useState({
    branding: true,
    docInfo: true,
    recipient: true,
    content: true,
    footer: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFieldChange = <K extends keyof DocumentData>(field: K, value: DocumentData[K]) => {
    const updated = { ...currentDoc, [field]: value };
    onChangeDoc(updated);
  };

  // Dynamic invoice items management
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...(currentDoc.items || [])];
    const item = { ...newItems[index] };

    if (field === 'description') {
      item.description = String(value);
    } else if (field === 'quantity') {
      item.quantity = Number(value) || 0;
      item.total = item.quantity * item.unitPrice;
    } else if (field === 'unitPrice') {
      item.unitPrice = Number(value) || 0;
      item.total = item.quantity * item.unitPrice;
    }

    newItems[index] = item;

    // Recalculate totals
    const subtotal = newItems.reduce((acc, curr) => acc + (curr.total || 0), 0);
    const taxAmount = (subtotal - currentDoc.discount) * (currentDoc.taxPercent / 100);
    const totalPayable = subtotal - currentDoc.discount + taxAmount;
    const dueAmount = Math.max(0, totalPayable - currentDoc.paidAmount);

    onChangeDoc({
      ...currentDoc,
      items: newItems,
      subtotal,
      taxAmount,
      dueAmount
    });
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: 'নতুন সেবা বা পণ্যের বিবরণ',
      quantity: 1,
      unitPrice: 1000,
      total: 1000
    };
    const newItems = [...(currentDoc.items || []), newItem];
    const subtotal = newItems.reduce((acc, curr) => acc + (curr.total || 0), 0);
    const taxAmount = (subtotal - currentDoc.discount) * (currentDoc.taxPercent / 100);
    const dueAmount = Math.max(0, subtotal - currentDoc.discount + taxAmount - currentDoc.paidAmount);

    onChangeDoc({
      ...currentDoc,
      items: newItems,
      subtotal,
      taxAmount,
      dueAmount
    });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = currentDoc.items.filter((_, i) => i !== index);
    const subtotal = newItems.reduce((acc, curr) => acc + (curr.total || 0), 0);
    const taxAmount = (subtotal - currentDoc.discount) * (currentDoc.taxPercent / 100);
    const dueAmount = Math.max(0, subtotal - currentDoc.discount + taxAmount - currentDoc.paidAmount);

    onChangeDoc({
      ...currentDoc,
      items: newItems,
      subtotal,
      taxAmount,
      dueAmount
    });
  };

  const handleDiscountChange = (discountVal: number) => {
    const subtotal = currentDoc.subtotal || 0;
    const taxAmount = (subtotal - discountVal) * (currentDoc.taxPercent / 100);
    const dueAmount = Math.max(0, subtotal - discountVal + taxAmount - currentDoc.paidAmount);

    onChangeDoc({
      ...currentDoc,
      discount: discountVal,
      taxAmount,
      dueAmount
    });
  };

  const handleTaxPercentChange = (taxPercent: number) => {
    const subtotal = currentDoc.subtotal || 0;
    const taxAmount = (subtotal - currentDoc.discount) * (taxPercent / 100);
    const dueAmount = Math.max(0, subtotal - currentDoc.discount + taxAmount - currentDoc.paidAmount);

    onChangeDoc({
      ...currentDoc,
      taxPercent,
      taxAmount,
      dueAmount
    });
  };

  const handlePaidChange = (paidVal: number) => {
    const totalPayable = currentDoc.subtotal - currentDoc.discount + currentDoc.taxAmount;
    const dueAmount = Math.max(0, totalPayable - paidVal);

    onChangeDoc({
      ...currentDoc,
      paidAmount: paidVal,
      dueAmount
    });
  };

  // Logo or Signature Image upload handler
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'signature'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          if (type === 'logo') {
            handleFieldChange('orgLogoUrl', reader.result);
          } else {
            handleFieldChange('signatureUrl', reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // PDF Generation Trigger
  const handleGeneratePdf = async () => {
    setIsGenerating(true);
    setGenerationStage(lang === 'bn' ? 'পিডিএফ প্রস্তুত হচ্ছে...' : 'Preparing PDF...');

    const targetFileName =
      currentDoc.title?.includes('সংশোধন') || currentDoc.title?.includes('ফরম')
        ? 'correction_form.pdf'
        : `${(currentDoc.title || 'document').replace(/\s+/g, '_')}_${currentDoc.docNumber || 'DOC'}.pdf`;
    const success = await generateAndDownloadPdf({
      fileName: targetFileName,
      elementId: 'pdf-render-area',
      onProgress: (_, stage) => setGenerationStage(stage)
    });

    setIsGenerating(false);

    if (success) {
      // Increment download counter and save to document history
      const updated = {
        ...currentDoc,
        downloadCount: (currentDoc.downloadCount || 0) + 1,
        updatedAt: new Date().toLocaleDateString('bn-BD')
      };
      onChangeDoc(updated);
      onSaveToHistory(updated);

      setStatusMessage(
        lang === 'bn'
          ? 'পিডিএফ সফলভাবে জেনারেট এবং ডাউনলোড হয়েছে!'
          : 'PDF generated and downloaded successfully!'
      );
      setTimeout(() => setStatusMessage(''), 4000);
    } else {
      setStatusMessage(
        lang === 'bn' ? 'পিডিএফ জেনারেট করতে সমস্যা হয়েছে' : 'Failed to generate PDF'
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Mobile view toggle tabs */}
      <div className="flex lg:hidden items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
        <button
          onClick={() => setActiveTabMobile('form')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
            activeTabMobile === 'form' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          {lang === 'bn' ? '১. তথ্য পূরণ করুন' : '1. Edit Information'}
        </button>
        <button
          onClick={() => setActiveTabMobile('preview')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
            activeTabMobile === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          {lang === 'bn' ? '২. লাইভ প্রিভিউ ও ডাউনলোড' : '2. Live Preview & Download'}
        </button>
      </div>

      {/* Editor & Preview Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Controls (7 cols on lg) */}
        <div
          className={`lg:col-span-5 space-y-5 ${
            activeTabMobile === 'form' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Top Template Selector & Actions */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  {lang === 'bn' ? 'বর্তমান ডেমো টেমপ্লেট' : 'Active Template'}
                </label>
                <select
                  value={currentDoc.templateId}
                  onChange={(e) => onSwitchTemplate(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 w-full"
                >
                  {availableTemplates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {lang === 'bn' ? t.banglaName : t.name} ({t.badgeLabel})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={onResetToDemo}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 hover:bg-slate-800 px-2 py-1.5 rounded transition-colors"
                title={lang === 'bn' ? 'ডেমো তথ্যে রিসেট করুন' : 'Reset to default demo'}
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{lang === 'bn' ? 'রিসেট' : 'Reset'}</span>
              </button>
            </div>

            {/* Color Accent Picker */}
            <div>
              <span className="text-xs font-medium text-slate-300 block mb-2">
                {lang === 'bn' ? 'ব্র্যান্ড থিম কালার' : 'Brand Theme Color'}:
              </span>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => handleFieldChange('primaryColor', preset.hex)}
                    style={{ backgroundColor: preset.hex }}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      currentDoc.primaryColor === preset.hex
                        ? 'scale-125 border-white shadow-md'
                        : 'border-transparent hover:scale-110'
                    }`}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>

            {/* Watermark & Stamp Toggles */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={currentDoc.showWatermark}
                  onChange={(e) => handleFieldChange('showWatermark', e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span>{lang === 'bn' ? 'ওয়াটারমার্ক ব্যাকগ্রাউন্ড' : 'Watermark'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={currentDoc.showPaidStamp}
                  onChange={(e) => handleFieldChange('showPaidStamp', e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span>{lang === 'bn' ? 'অফিসিয়াল সিল/স্ট্যাম্প' : 'Official Stamp'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={currentDoc.showQrCode}
                  onChange={(e) => handleFieldChange('showQrCode', e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span>{lang === 'bn' ? 'ভেরিফিকেশন QR কোড' : 'QR Verification'}</span>
              </label>

              {currentDoc.showPaidStamp && (
                <select
                  value={currentDoc.paidStampStatus || 'PAID'}
                  onChange={(e) =>
                    handleFieldChange(
                      'paidStampStatus',
                      e.target.value as 'PAID' | 'APPROVED' | 'VERIFIED'
                    )
                  }
                  className="px-2 py-1 text-[11px] bg-slate-900 border border-slate-700 rounded text-slate-200"
                >
                  <option value="PAID">পরিশোধিত (PAID)</option>
                  <option value="APPROVED">অনুমোদিত (APPROVED)</option>
                  <option value="VERIFIED">যাচাইকৃত (VERIFIED)</option>
                </select>
              )}
            </div>
          </div>

          {/* Section 1: Organization Details */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('branding')}
              className="w-full px-4 py-3 bg-slate-900/60 flex items-center justify-between text-xs font-bold text-white hover:bg-slate-900 transition-colors"
            >
              <span>১. প্রতিষ্ঠান / প্রেরক তথ্য (Organization Details)</span>
              {openSections.branding ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {openSections.branding && (
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    প্রতিষ্ঠানের নাম / কোম্পানির নাম
                  </label>
                  <input
                    type="text"
                    value={currentDoc.orgName}
                    onChange={(e) => handleFieldChange('orgName', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    ট্যাগলাইন বা স্লোগান (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={currentDoc.orgTagline || ''}
                    onChange={(e) => handleFieldChange('orgTagline', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">ফোন নম্বর</label>
                    <input
                      type="text"
                      value={currentDoc.orgPhone || ''}
                      onChange={(e) => handleFieldChange('orgPhone', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">ইমেইল ঠিকানা</label>
                    <input
                      type="email"
                      value={currentDoc.orgEmail || ''}
                      onChange={(e) => handleFieldChange('orgEmail', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">ঠিকানা</label>
                  <input
                    type="text"
                    value={currentDoc.orgAddress || ''}
                    onChange={(e) => handleFieldChange('orgAddress', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    লোগো বা মনোগ্রাম আপলোড (ঐচ্ছিক)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg cursor-pointer flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>ছবি নির্বাচন</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'logo')}
                        className="hidden"
                      />
                    </label>
                    {currentDoc.orgLogoUrl && (
                      <button
                        type="button"
                        onClick={() => handleFieldChange('orgLogoUrl', undefined)}
                        className="text-xs text-rose-400 hover:underline"
                      >
                        মুছুন
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Document Numbers & Date */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('docInfo')}
              className="w-full px-4 py-3 bg-slate-900/60 flex items-center justify-between text-xs font-bold text-white hover:bg-slate-900 transition-colors"
            >
              <span>২. ডকুমেন্ট আইডি ও তারিখ (Document ID & Date)</span>
              {openSections.docInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {openSections.docInfo && (
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">ডকুমেন্ট টাইটেল</label>
                    <input
                      type="text"
                      value={currentDoc.title}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      ইনভয়েস / স্মারক নম্বর
                    </label>
                    <input
                      type="text"
                      value={currentDoc.docNumber}
                      onChange={(e) => handleFieldChange('docNumber', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">ইস্যু তারিখ</label>
                    <input
                      type="text"
                      value={currentDoc.docDate}
                      onChange={(e) => handleFieldChange('docDate', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">মেয়াদ / Due Date</label>
                    <input
                      type="text"
                      value={currentDoc.dueDate || ''}
                      onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                      placeholder="যেমন: ১৫ অক্টোবর ২০২৬"
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Recipient / Client Details */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('recipient')}
              className="w-full px-4 py-3 bg-slate-900/60 flex items-center justify-between text-xs font-bold text-white hover:bg-slate-900 transition-colors"
            >
              <span>৩. প্রাপক বা ক্লায়েন্ট তথ্য (Recipient Information)</span>
              {openSections.recipient ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {openSections.recipient && (
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">নাম</label>
                    <input
                      type="text"
                      value={currentDoc.recipientName}
                      onChange={(e) => handleFieldChange('recipientName', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">পদবী / রোল</label>
                    <input
                      type="text"
                      value={currentDoc.recipientDesignation || ''}
                      onChange={(e) => handleFieldChange('recipientDesignation', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">প্রতিষ্ঠান / বিভাগ</label>
                    <input
                      type="text"
                      value={currentDoc.recipientOrg || ''}
                      onChange={(e) => handleFieldChange('recipientOrg', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">মোবাইল</label>
                    <input
                      type="text"
                      value={currentDoc.recipientPhone || ''}
                      onChange={(e) => handleFieldChange('recipientPhone', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">ঠিকানা</label>
                  <input
                    type="text"
                    value={currentDoc.recipientAddress || ''}
                    onChange={(e) => handleFieldChange('recipientAddress', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Content / Items Table */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('content')}
              className="w-full px-4 py-3 bg-slate-900/60 flex items-center justify-between text-xs font-bold text-white hover:bg-slate-900 transition-colors"
            >
              <span>
                {currentDoc.templateType === 'invoice' || currentDoc.templateType === 'receipt'
                  ? '৪. পণ্য/সেবার তালিকা ও হিসাব (Items & Calculations)'
                  : '৪. বিষয় ও মূল বিবরণ (Main Content Body)'}
              </span>
              {openSections.content ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {openSections.content && (
              <div className="p-4 space-y-4">
                {currentDoc.templateType === 'invoice' || currentDoc.templateType === 'receipt' ? (
                  <>
                    <div className="space-y-3">
                      {currentDoc.items?.map((item, idx) => (
                        <div
                          key={item.id}
                          className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono text-slate-500">আইটেম #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-rose-400 hover:text-rose-300 p-1"
                              title="আইটেম মুছুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                            placeholder="পণ্য বা সেবার বিবরণ"
                            className="w-full px-2.5 py-1 text-xs bg-slate-950 border border-slate-700 rounded text-white"
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <span className="text-[10px] text-slate-500">পরিমাণ</span>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                                className="w-full px-2 py-1 text-xs bg-slate-950 border border-slate-700 rounded text-white font-mono"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500">একক দর ({currentDoc.currency})</span>
                              <input
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                                className="w-full px-2 py-1 text-xs bg-slate-950 border border-slate-700 rounded text-white font-mono"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500">মোট</span>
                              <div className="px-2 py-1 text-xs bg-slate-900 border border-slate-800 rounded text-indigo-300 font-mono">
                                {Number(item.total).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="w-full py-2 text-xs font-semibold text-indigo-400 bg-indigo-950/40 hover:bg-indigo-950/80 border border-indigo-800/40 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>নতুন আইটেম যোগ করুন</span>
                      </button>
                    </div>

                    {/* Calculation Controls */}
                    <div className="pt-3 border-t border-slate-800 grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">ডিসকাউন্ট ({currentDoc.currency})</label>
                        <input
                          type="number"
                          value={currentDoc.discount || 0}
                          onChange={(e) => handleDiscountChange(Number(e.target.value) || 0)}
                          className="w-full px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">ভ্যাট / ট্যাক্স (%)</label>
                        <input
                          type="number"
                          value={currentDoc.taxPercent || 0}
                          onChange={(e) => handleTaxPercentChange(Number(e.target.value) || 0)}
                          className="w-full px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">জমা / পেইড ({currentDoc.currency})</label>
                        <input
                          type="number"
                          value={currentDoc.paidAmount || 0}
                          onChange={(e) => handlePaidChange(Number(e.target.value) || 0)}
                          className="w-full px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">কথায় (Amount in Words)</label>
                        <input
                          type="text"
                          value={currentDoc.amountInWords || ''}
                          onChange={(e) => handleFieldChange('amountInWords', e.target.value)}
                          placeholder="যেমন: এক লক্ষ টাকা মাত্র"
                          className="w-full px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">পেমেন্ট মেথড</label>
                        <input
                          type="text"
                          value={currentDoc.paymentMethod || ''}
                          onChange={(e) => handleFieldChange('paymentMethod', e.target.value)}
                          placeholder="ক্যাশ / ব্যাংক ট্রান্সফার / বিকাশ"
                          className="w-full px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-white"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">বিষয় (Subject)</label>
                      <input
                        type="text"
                        value={currentDoc.memoSubject || ''}
                        onChange={(e) => handleFieldChange('memoSubject', e.target.value)}
                        placeholder="ডকুমেন্টের বিষয়বস্তু"
                        className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        মূল বক্তব্য / প্রত্যয়ন বিবরণ
                      </label>
                      <textarea
                        rows={6}
                        value={currentDoc.bodyContent || ''}
                        onChange={(e) => handleFieldChange('bodyContent', e.target.value)}
                        placeholder="বিস্তারিত বিষয়বস্তু এখানে লিখুন..."
                        className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Section 5: Footer & Authorized Signatory */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('footer')}
              className="w-full px-4 py-3 bg-slate-900/60 flex items-center justify-between text-xs font-bold text-white hover:bg-slate-900 transition-colors"
            >
              <span>৫. শর্তাবলী ও অনুমোদিত স্বাক্ষর (Terms & Signatures)</span>
              {openSections.footer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {openSections.footer && (
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">স্বাক্ষরকারীর নাম</label>
                    <input
                      type="text"
                      value={currentDoc.signatoryName || ''}
                      onChange={(e) => handleFieldChange('signatoryName', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">পদবী / দায়িত্ব</label>
                    <input
                      type="text"
                      value={currentDoc.signatoryTitle || ''}
                      onChange={(e) => handleFieldChange('signatoryTitle', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    ডিজিটাল স্বাক্ষর ছবি (ঐচ্ছিক)
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg cursor-pointer">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>স্বাক্ষর আপলোড</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'signature')}
                      className="hidden"
                    />
                  </label>
                  {currentDoc.signatureUrl && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange('signatureUrl', undefined)}
                      className="ml-3 text-xs text-rose-400 hover:underline"
                    >
                      মুছুন
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">শর্তাবলী / নোট</label>
                  <textarea
                    rows={2}
                    value={currentDoc.terms || currentDoc.notes || ''}
                    onChange={(e) => handleFieldChange('terms', e.target.value)}
                    placeholder="নোট বা শর্তাবলী..."
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live A4 Preview & Download Toolbar (7 cols on lg) */}
        <div
          className={`lg:col-span-7 space-y-4 ${
            activeTabMobile === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Action Toolbar Header */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-sm sticky top-20 z-30">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setScale((s) => Math.max(0.4, Number((s - 0.1).toFixed(2))))}
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                title="ছোট করুন"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono px-2 text-slate-300">
                {Math.round(scale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setScale((s) => Math.min(1.4, Number((s + 0.1).toFixed(2))))}
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                title="বড় করুন"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setScale(0.85)}
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors text-xs font-mono"
                title="ফিট করুন"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Print, Save Draft, and Generate Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onSaveToHistory(currentDoc);
                  setStatusMessage(lang === 'bn' ? 'ড্রাফট সেভ হয়েছে!' : 'Saved to drafts!');
                  setTimeout(() => setStatusMessage(''), 3000);
                }}
                className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'সেভ ড্রাফট' : 'Save Draft'}</span>
              </button>

              <button
                type="button"
                onClick={triggerBrowserPrint}
                className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
                title="প্রিন্টার বা ব্রাউজারে প্রিন্ট করুন"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
              </button>

              {/* Main Primary Action: Generate PDF & Download */}
              <button
                type="button"
                onClick={handleGeneratePdf}
                disabled={isGenerating}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{generationStage || 'জেনারেট হচ্ছে...'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'পিডিএফ জেনারেট ও ডাউনলোড' : 'Generate & Download PDF'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Status Alert Banner */}
          {statusMessage && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-700/60 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* A4 Canvas Container with subtle background grid */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-6 overflow-auto min-h-[750px] flex justify-center items-start shadow-inner">
            <PdfPaperPreview data={currentDoc} scale={scale} />
          </div>
        </div>
      </div>
    </div>
  );
};
