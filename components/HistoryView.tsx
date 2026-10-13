'use client';

import React, { useState } from 'react';
import { DocumentData } from '@/types/pdf';
import { Download, Edit3, Copy, Trash2, Search, FileText, ArrowLeft } from 'lucide-react';

interface HistoryViewProps {
  documents: DocumentData[];
  onDownloadPdf: (doc: DocumentData) => void;
  onEditDoc: (doc: DocumentData) => void;
  onDuplicateDoc: (doc: DocumentData) => void;
  onDeleteDoc: (docId: string) => void;
  onNavigateToEditor: () => void;
  lang: 'bn' | 'en';
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  documents,
  onDownloadPdf,
  onEditDoc,
  onDuplicateDoc,
  onDeleteDoc,
  onNavigateToEditor,
  lang
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.docNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.recipientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {lang === 'bn' ? 'ডকুমেন্ট তৈরির হিস্টোরি ও ডাউনলোড তালিকা' : 'Document History & Downloads'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {lang === 'bn'
              ? 'আপনার পূর্বে তৈরি করা সকল পিডিএফের বিবরণ। যেকোনো সময় পুনরায় ডাউনলোড বা এডিট করতে পারেন।'
              : 'All your previously generated PDFs. Re-download or edit anytime.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'bn' ? 'খুঁজুন...' : 'Search...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-48"
            />
          </div>

          <button
            onClick={onNavigateToEditor}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
          >
            {lang === 'bn' ? '+ নতুন পিডিএফ' : '+ New PDF'}
          </button>
        </div>
      </div>

      <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">{lang === 'bn' ? 'নথির নাম ও নম্বর' : 'Title & Ref'}</th>
                  <th className="py-3 px-4">{lang === 'bn' ? 'প্রতিষ্ঠান / ইস্যুকারী' : 'Organization'}</th>
                  <th className="py-3 px-4">{lang === 'bn' ? 'প্রাপক' : 'Recipient'}</th>
                  <th className="py-3 px-4">{lang === 'bn' ? 'তারিখ' : 'Date'}</th>
                  <th className="py-3 px-4 text-center">{lang === 'bn' ? 'ডাউনলোড' : 'Downloads'}</th>
                  <th className="py-3 px-4 text-right">{lang === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-850 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white truncate max-w-[220px]">
                        {doc.title}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {doc.docNumber || 'DOC-001'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 truncate max-w-[180px]">
                      {doc.orgName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 truncate max-w-[150px]">
                      {doc.recipientName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {doc.createdAt}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-200">
                      {doc.downloadCount || 0}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onDownloadPdf(doc)}
                          className="px-2.5 py-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/40 rounded flex items-center gap-1 transition-colors"
                          title="পিডিএফ ফাইল ডাউনলোড"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>ডাউনলোড</span>
                        </button>
                        <button
                          onClick={() => onEditDoc(doc)}
                          className="p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40 rounded transition-colors"
                          title="এডিট করুন"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDuplicateDoc(doc)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                          title="ডুপ্লিকেট করুন"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteDoc(doc.id)}
                          className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors"
                          title="মুছে ফেলুন"
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
              {lang === 'bn' ? 'কোনো ইতিহাস পাওয়া যায়নি' : 'No history found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
