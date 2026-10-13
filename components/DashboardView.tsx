'use client';

import React, { useState } from 'react';
import { DemoTemplate, DocumentData, TemplateCategory } from '@/types/pdf';
import {
  FileText,
  Download,
  Plus,
  Upload,
  Search,
  Copy,
  Trash2,
  Edit3,
  ExternalLink,
  Layers,
  ArrowRight,
  Database
} from 'lucide-react';

interface DashboardViewProps {
  demoTemplates: DemoTemplate[];
  recentDocs: DocumentData[];
  onSelectTemplate: (template: DemoTemplate) => void;
  onEditDoc: (doc: DocumentData) => void;
  onDuplicateDoc: (doc: DocumentData) => void;
  onDeleteDoc: (docId: string) => void;
  onDownloadDocPdf: (doc: DocumentData) => void;
  onOpenUploadModal: () => void;
  onNavigateToEditor: () => void;
  lang: 'bn' | 'en';
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  demoTemplates,
  recentDocs,
  onSelectTemplate,
  onEditDoc,
  onDuplicateDoc,
  onDeleteDoc,
  onDownloadDocPdf,
  onOpenUploadModal,
  onNavigateToEditor,
  lang
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const totalDownloads = recentDocs.reduce((acc, curr) => acc + (curr.downloadCount || 0), 0);
  const totalCreated = recentDocs.length;
  const customUploadedCount = demoTemplates.filter((t) => t.isCustomUploaded).length;

  const filteredDocs = recentDocs.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.docNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.orgName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.templateType === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (category: TemplateCategory) => {
    switch (category) {
      case 'invoice':
        return lang === 'bn' ? 'চালান / ইনভয়েস' : 'Invoice';
      case 'receipt':
        return lang === 'bn' ? 'টাকা প্রাপ্তির রশিদ' : 'Money Receipt';
      case 'certificate':
        return lang === 'bn' ? 'প্রত্যয়ন পত্র / সনদ' : 'Certificate';
      case 'cv':
        return lang === 'bn' ? 'সিভি / জীবনবৃত্তান্ত' : 'CV / Resume';
      case 'memo':
        return lang === 'bn' ? 'অফিস আদেশ / নোটিশ' : 'Office Memo';
      case 'custom':
        return lang === 'bn' ? 'কাস্টম পিডিএফ' : 'Custom PDF';
      default:
        return category;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome & Summary Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {lang === 'bn' ? 'পিডিএফ মেকার ড্যাশবোর্ড' : 'PDF Maker Dashboard'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {lang === 'bn'
              ? 'যেকোনো ডেমো পিডিএফ আপলোড করে রাখুন, তথ্য পরিবর্তন করে তাৎক্ষণিক নতুন PDF জেনারেট ও ডাউনলোড করুন'
              : 'Store reference demo PDFs, customize form values, and generate high-fidelity PDFs instantly'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/50 rounded-lg transition-colors shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span>{lang === 'bn' ? 'পিডিএফ ডেমো আপলোড করুন' : 'Upload Demo PDF'}</span>
          </button>

          <button
            onClick={onNavigateToEditor}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'bn' ? 'নতুন পিডিএফ তৈরি করুন' : 'Create New PDF'}</span>
          </button>
        </div>
      </div>

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{lang === 'bn' ? 'তৈরি করা পিডিএফ' : 'Generated PDFs'}</span>
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            {totalCreated}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'bn' ? 'সিস্টেমে সংরক্ষিত মোট নথি' : 'Total documents stored'}
          </p>
        </div>

        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{lang === 'bn' ? 'মোট ডাউনলোড' : 'Total Downloads'}</span>
            <Download className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            {totalDownloads}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'bn' ? 'সরাসরি ডাউনলোড সংখ্যা' : 'Direct PDF file exports'}
          </p>
        </div>

        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{lang === 'bn' ? 'সক্রিয় ডেমো টেমপ্লেট' : 'Active Demo Templates'}</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            {demoTemplates.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {customUploadedCount > 0
              ? `${customUploadedCount} টি কাস্টম আপলোড সহ`
              : lang === 'bn'
              ? 'তৈরি করার জন্য প্রস্তুত'
              : 'Ready to generate'}
          </p>
        </div>

        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{lang === 'bn' ? 'কাস্টম আপলোড ডেমো' : 'Uploaded Custom Demos'}</span>
            <Database className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            {customUploadedCount}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'bn' ? 'ব্যবহারকারীর নিজস্ব সংরক্ষিত PDF' : 'User uploaded templates'}
          </p>
        </div>
      </div>

      {/* Featured Demo Upload & Generator Banner */}
      <div className="rounded-xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-900/40 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            <span>{lang === 'bn' ? 'ডেমো পিডিএফ সুবিধা' : 'Demo PDF Feature'}</span>
            <span>·</span>
            <span>{lang === 'bn' ? 'সহজ রূপান্তর ও জেনারেট' : 'Instant Generation'}</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            {lang === 'bn'
              ? 'আপনার কোনো চালান, ভাউচার বা প্রত্যয়ন পিডিএফ আপলোড করে রাখুন'
              : 'Upload your Invoice, Voucher or Certificate PDF as a Demo Template'}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'bn'
              ? 'সিস্টেমে ডেমো হিসেবে জমা থাকবে। পরবর্তী সময়ে আপনি কেবল পরিমাণ, নাম ও তথ্য পরিবর্তন করে জেনারেট বাটনে ক্লিক করলেই মুহূর্তের মধ্যে হুবহু প্রিন্ট উপযোগী পিডিএফ তৈরি হয়ে যাবে।'
              : 'Saved as a reference demo. You simply edit customer, date, or line items and click Generate to download a ready-to-print PDF.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenUploadModal}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>{lang === 'bn' ? 'এখনই PDF আপলোড করুন' : 'Upload PDF Demo Now'}</span>
          </button>
        </div>
      </div>

      {/* Demo Templates Shelf */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">
              {lang === 'bn' ? 'সংরক্ষিত ডেমো টেমপ্লেটসমূহ' : 'Saved Demo Templates'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'bn'
                ? 'যেকোনো ডেমো পছন্দ করুন এবং প্রয়োজনীয় তথ্য লিখে সরাসরি পিডিএফ জেনারেট করুন'
                : 'Select any demo template and fill fields to generate your PDF'}
            </p>
          </div>
          <button
            onClick={onOpenUploadModal}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
          >
            <span>+ {lang === 'bn' ? 'নতুন ডেমো যোগ করুন' : 'Add New Demo'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {demoTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-[#0F172A] border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-indigo-400">
                    {template.badgeLabel}
                  </span>
                  {template.isCustomUploaded ? (
                    <span className="text-[11px] text-amber-400 font-mono">
                      {lang === 'bn' ? 'কাস্টম আপলোড' : 'Custom Upload'}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-mono">
                      {lang === 'bn' ? 'স্ট্যান্ডার্ড ডেমো' : 'Built-in Demo'}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {lang === 'bn' ? template.banglaName : template.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {template.description}
                </p>

                {template.originalFileName && (
                  <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1 font-mono truncate">
                    <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{template.originalFileName}</span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                {template.uploadedPdfUrl ? (
                  <a
                    href={template.uploadedPdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{lang === 'bn' ? 'আসল PDF' : 'Original PDF'}</span>
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-500">
                    A4 রেডি টেমপ্লেট
                  </span>
                )}

                <button
                  onClick={() => onSelectTemplate(template)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-indigo-600 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>{lang === 'bn' ? 'তথ্য পূরণ ও জেনারেট' : 'Fill & Generate'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Generated Documents Table */}
      <section className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white">
              {lang === 'bn' ? 'সাম্প্রতিক তৈরি করা পিডিএফ ডকুমেন্টস' : 'Recently Generated PDFs'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'bn'
                ? 'তৈরি করা যেকোনো ডকুমেন্ট পুনরায় ডাউনলোড, এডিট অথবা ডুপ্লিকেট করুন'
                : 'Download, edit or clone any created document anytime'}
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={lang === 'bn' ? 'নথি খুঁজুন...' : 'Search docs...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-44"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">{lang === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}</option>
              <option value="invoice">{lang === 'bn' ? 'চালান' : 'Invoice'}</option>
              <option value="receipt">{lang === 'bn' ? 'মানি রিসিট' : 'Receipt'}</option>
              <option value="certificate">{lang === 'bn' ? 'প্রত্যয়ন' : 'Certificate'}</option>
              <option value="cv">{lang === 'bn' ? 'সিভি' : 'CV'}</option>
              <option value="memo">{lang === 'bn' ? 'মেমো' : 'Memo'}</option>
            </select>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          {filteredDocs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">{lang === 'bn' ? 'ডকুমেন্ট শিরোনাম ও নম্বর' : 'Title & Number'}</th>
                    <th className="py-3 px-4">{lang === 'bn' ? 'ধরন' : 'Type'}</th>
                    <th className="py-3 px-4">{lang === 'bn' ? 'প্রাপক / ব্যক্তি' : 'Recipient'}</th>
                    <th className="py-3 px-4">{lang === 'bn' ? 'তৈরির তারিখ' : 'Date'}</th>
                    <th className="py-3 px-4 text-center">{lang === 'bn' ? 'ডাউনলোড' : 'Downloads'}</th>
                    <th className="py-3 px-4 text-right">{lang === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-850 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white truncate max-w-[220px]">
                          {doc.title}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {doc.docNumber || 'DOC-NO-REF'}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-slate-300">
                          {getCategoryLabel(doc.templateType)}
                        </span>
                      </td>
                      <td className="py-3 px-4 truncate max-w-[160px] text-slate-300">
                        {doc.recipientName || 'সাধারণ'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                        {doc.createdAt}
                      </td>
                      <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-300">
                        {doc.downloadCount || 0}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onDownloadDocPdf(doc)}
                            className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 rounded transition-colors"
                            title={lang === 'bn' ? 'সরাসরি PDF ডাউনলোড' : 'Download PDF'}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditDoc(doc)}
                            className="p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40 rounded transition-colors"
                            title={lang === 'bn' ? 'এডিট করুন' : 'Edit'}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDuplicateDoc(doc)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                            title={lang === 'bn' ? 'ডুপ্লিকেট করুন' : 'Duplicate'}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteDoc(doc.id)}
                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors"
                            title={lang === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-medium text-slate-300">
                {lang === 'bn' ? 'কোনো সংরক্ষিত ডকুমেন্ট পাওয়া যায়নি' : 'No documents found'}
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {lang === 'bn'
                  ? 'উপরে "নতুন পিডিএফ তৈরি করুন" অথবা "পিডিএফ ডেমো আপলোড করুন" বাটনে ক্লিক করে প্রথম ডকুমেন্ট তৈরি করুন।'
                  : 'Click Create New PDF or Upload Demo PDF above to start.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
