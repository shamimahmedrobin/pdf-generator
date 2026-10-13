'use client';

import React from 'react';
import { DemoTemplate, DocumentData } from '@/types/pdf';
import { Upload, FileText, ArrowRight, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

interface TemplatesGalleryViewProps {
  demoTemplates: DemoTemplate[];
  onSelectTemplate: (template: DemoTemplate) => void;
  onOpenUploadModal: () => void;
  lang: 'bn' | 'en';
}

export const TemplatesGalleryView: React.FC<TemplatesGalleryViewProps> = ({
  demoTemplates,
  onSelectTemplate,
  onOpenUploadModal,
  lang
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {lang === 'bn' ? 'ডেমো টেমপ্লেট লাইব্রেরি' : 'Demo Templates Library'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {lang === 'bn'
              ? 'যেকোনো ডেমো পছন্দ করে তাৎক্ষণিক তথ্য পূরণ করুন অথবা আপনার নিজস্ব কোনো পিডিএফ আপলোড করে ডেমো হিসেবে যুক্ত করুন'
              : 'Pick any demo to fill details, or upload your own PDF to save as a custom demo template'}
          </p>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>{lang === 'bn' ? 'নতুন পিডিএফ ডেমো আপলোড করুন' : 'Upload New Demo PDF'}</span>
        </button>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-[#0F172A] border border-slate-800 hover:border-indigo-500/40 rounded-xl p-6 flex flex-col justify-between transition-all group shadow-sm hover:shadow-indigo-500/5"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-semibold text-indigo-400">
                  {template.badgeLabel}
                </span>
                {template.isCustomUploaded ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    {lang === 'bn' ? 'ব্যবহারকারীর আপলোড' : 'User Upload'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                    {lang === 'bn' ? 'বিল্ট-ইন ডেমো' : 'Built-in Demo'}
                  </span>
                )}
              </div>

              <h2 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                {lang === 'bn' ? template.banglaName : template.name}
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {template.description}
              </p>

              {/* Sample info points */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>বাংলা ও ইংরেজি নিখুঁত ফন্ট সাপোর্ট</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>ভেরিফিকেশন কিউআর কোড ও ডিজিটাল সিল</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>A4 সাইজ রেডি ও এক ক্লিকে ডাউনলোড</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
              {template.uploadedPdfUrl ? (
                <a
                  href={template.uploadedPdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'আসল PDF দেখুন' : 'Original PDF'}</span>
                </a>
              ) : (
                <span className="text-[11px] text-slate-500">
                  {lang === 'bn' ? 'রেডিমেড ডেমো' : 'Ready template'}
                </span>
              )}

              <button
                onClick={() => onSelectTemplate(template)}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>{lang === 'bn' ? 'তথ্য লিখে PDF বানান' : 'Create from Demo'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
