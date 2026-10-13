'use client';

import React from 'react';
import { FileText, Plus, LayoutDashboard, FileSpreadsheet, History, Globe } from 'lucide-react';

interface NavbarProps {
  currentTab: 'dashboard' | 'editor' | 'templates' | 'history';
  onSelectTab: (tab: 'dashboard' | 'editor' | 'templates' | 'history') => void;
  onOpenUpload: () => void;
  lang: 'bn' | 'en';
  onToggleLang: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenUpload,
  lang,
  onToggleLang
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand title, single clean text element */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <FileText className="w-5 h-5" />
          </div>
          <button
            onClick={() => onSelectTab('dashboard')}
            className="text-left group"
          >
            <span className="text-lg font-bold tracking-tight text-white block group-hover:text-indigo-300 transition-colors">
              {lang === 'bn' ? 'সহজPDF স্টুডিও' : 'Shohoj PDF Studio'}
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              currentTab === 'dashboard'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}</span>
          </button>

          <button
            onClick={() => onSelectTab('editor')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              currentTab === 'editor'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{lang === 'bn' ? 'পিডিএফ তৈরি' : 'Create PDF'}</span>
          </button>

          <button
            onClick={() => onSelectTab('templates')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              currentTab === 'templates'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{lang === 'bn' ? 'ডেমো টেমপ্লেট' : 'Templates & Demos'}</span>
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              currentTab === 'history'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <History className="w-4 h-4" />
            <span>{lang === 'bn' ? 'হিস্টোরি' : 'History'}</span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors"
            title="ভাষা পরিবর্তন করুন / Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('editor');
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'bn' ? 'নতুন PDF বানান' : 'Create PDF'}</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/50 rounded-lg transition-colors"
          >
            <span>{lang === 'bn' ? 'PDF ডেমো আপলোড' : 'Upload Demo'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
