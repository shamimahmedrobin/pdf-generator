import { DemoTemplate, DocumentData } from '@/types/pdf';

export const INITIAL_DEMO_TEMPLATES: DemoTemplate[] = [
  {
    id: 'demo-invoice-bn',
    name: 'Commercial Invoice & Cash Memo',
    banglaName: 'বিজনেস চালান ও ক্যাশ মেমো',
    category: 'invoice',
    description: 'ব্যবসায়িক পণ্য বিক্রি, সার্ভিস বিলিং ও ভ্যাট-ডিসকাউন্টসহ আকর্ষণীয় ইনভয়েস',
    badgeLabel: 'চালান / ইনভয়েস',
    defaultData: {
      templateType: 'invoice',
      title: 'ক্যাশ মেমো / ইনভয়েস',
      primaryColor: '#0284c7', // Sky-600
      fontFamily: 'Hind Siliguri, sans-serif',
      showWatermark: false,
      watermarkText: 'পরিশোধিত',
      showQrCode: true,
      showPaidStamp: true,
      paidStampStatus: 'PAID',
      currency: '৳',
      orgName: 'ডিজিটাল ট্রেডিং অ্যান্ড আইটি সলিউশন',
      orgTagline: 'প্রোডাক্ট সাপ্লাই, সার্ভিস ও টেকনোলজি পার্টনার',
      orgAddress: 'প্লট #১২, রোড #০৫, মতিঝিল বাণিজ্যিক এলাকা, ঢাকা-১০০০',
      orgPhone: '+৮৮০১৭১২-৩৪৫৬৭৮',
      orgEmail: 'billing@digitaltrading.com.bd',
      docNumber: 'INV-২০২৬/০৮৯',
      docDate: '০৭ অক্টোবর ২০২৬',
      dueDate: '১৫ অক্টোবর ২০২৬',
      recipientName: 'জনাব আরিফুল ইসলাম',
      recipientDesignation: 'ব্যবস্থাপনা পরিচালক',
      recipientOrg: 'প্রাইম লজিস্টিকস লিমিটেড',
      recipientAddress: 'মিরপুর ডিওএইচএস, রোড নং ৩, ঢাকা',
      recipientPhone: '+৮৮০১৮১১-৯৮৭৬৫৪',
      items: [
        { id: '1', description: 'ওয়েব ডেভেলপমেন্ট ও ই-কমার্স পোর্টাল সেটআপ', quantity: 1, unitPrice: 35000, total: 35000 },
        { id: '2', description: 'হাই-স্পিড ক্লাউড হোস্টিং ও ডোমেইন (১ বছর)', quantity: 1, unitPrice: 8500, total: 8500 },
        { id: '3', description: 'এসএসএল সিকিউরিটি ও মেইল সার্ভার কনফিগারেশন', quantity: 1, unitPrice: 4500, total: 4500 },
        { id: '4', description: 'বার্ষিক সফটওয়্যার মেইনটেন্যান্স সাপোর্ট', quantity: 1, unitPrice: 12000, total: 12000 }
      ],
      subtotal: 60000,
      discount: 3000,
      taxPercent: 5,
      taxAmount: 2850,
      paidAmount: 59850,
      dueAmount: 0,
      amountInWords: 'ঊনষাট হাজার আটশত পঞ্চাশ টাকা মাত্র',
      paymentMethod: 'ব্যাংক ট্রান্সফার / চেক',
      transactionId: 'TXN-98421045',
      notes: 'বিলের অর্থ পরিশোধ করায় আন্তরিক ধন্যবাদ। কোনো জিজ্ঞাসা থাকলে আমাদের সাপোর্ট সেন্টারে যোগাযোগ করুন।',
      terms: 'বিক্রিত সেবার ওয়ারেন্টি আগামী ১২ মাস পর্যন্ত বহাল থাকবে। সফটওয়্যারের সোর্স কোড ও ডকুমেন্টেশন হস্তান্তরিত হয়েছে।',
      signatoryName: 'মো: তানভীর হাসান',
      signatoryTitle: 'হিসাব রক্ষক ও অনুমোদিত স্বাক্ষরকারী'
    }
  },
  {
    id: 'demo-receipt-bn',
    name: 'Official Money Receipt',
    banglaName: 'টাকা প্রাপ্তির রশিদ (মানি রিসিট)',
    category: 'receipt',
    description: 'সংস্থা, প্রতিষ্ঠান, সমিতি বা ব্যবসায়ের ক্যাশ ও অনলাইন লেনদেনের ভাউচার',
    badgeLabel: 'মানি রিসিট',
    defaultData: {
      templateType: 'receipt',
      title: 'টাকা প্রাপ্তির রশিদ',
      primaryColor: '#059669', // Emerald-600
      fontFamily: 'Hind Siliguri, sans-serif',
      showWatermark: true,
      watermarkText: 'অফিসিয়াল কপি',
      showQrCode: true,
      showPaidStamp: true,
      paidStampStatus: 'VERIFIED',
      currency: '৳',
      orgName: 'অগ্রণী সমাজকল্যাণ সমিতি ও ফাউন্ডেশন',
      orgTagline: 'মানবসেবা ও আত্মকর্মসংস্থানে নিবেদিত',
      orgAddress: 'বাড়ি #৪৫, ধানমন্ডি আ/এ, ঢাকা-১২০৫',
      orgPhone: '+৮৮০২-৯৮৭৬২৪২',
      orgEmail: 'info@agrani-foundation.org',
      docNumber: 'MR-২০২৬/৪৪২',
      docDate: '০৭ অক্টোবর ২০২৬',
      recipientName: 'বেগম নাসরিন আক্তার',
      recipientDesignation: 'আজীবন সদস্য',
      recipientOrg: 'সোসাইটি মেম্বারশিপ শাখা',
      recipientAddress: 'সেক্টর ৪, উত্তরা মডেল টাউন, ঢাকা',
      recipientPhone: '+৮৮০১৭৫০-১১২২৩৩',
      items: [
        { id: '1', description: 'বার্ষিক সদস্য কল্যাণ তহবিল অনুদান', quantity: 1, unitPrice: 15000, total: 15000 },
        { id: '2', description: 'শিক্ষা ও স্বাস্থ্য ক্যাম্প ফান্ড', quantity: 1, unitPrice: 10000, total: 10000 }
      ],
      subtotal: 25000,
      discount: 0,
      taxPercent: 0,
      taxAmount: 0,
      paidAmount: 25000,
      dueAmount: 0,
      amountInWords: 'পঁচিশ হাজার টাকা মাত্র',
      paymentMethod: 'বিকাশ মার্চেন্ট পেমেন্ট',
      transactionId: 'BKASH-74628104',
      notes: 'আপনার এই সহযোগিতা আর্তমানবতার সেবায় বিশেষ ভূমিকা পালন করবে।',
      terms: 'এই রশিদ কম্পিউটার জেনারেটেড এবং কিউআর কোড স্ক্যান করে অনলাইন ডাটাবেজে যাচাইযোগ্য।',
      signatoryName: 'মাহবুবুর রহমান',
      signatoryTitle: 'কোষাধ্যক্ষ / সাধারণ সম্পাদক'
    }
  },
  {
    id: 'demo-certificate-bn',
    name: 'Official Testimonial Certificate',
    banglaName: 'অফিসিয়াল প্রত্যয়ন পত্র ও প্রশংসাপত্র',
    category: 'certificate',
    description: 'অভিজ্ঞতা সনদ, চারিত্রিক সনদ, শিক্ষার্থী প্রত্যয়ন অথবা কর্মসংস্থান প্রশংসাপত্র',
    badgeLabel: 'প্রত্যয়ন পত্র',
    defaultData: {
      templateType: 'certificate',
      title: 'প্রত্যয়ন পত্র (TO WHOM IT MAY CONCERN)',
      primaryColor: '#4f46e5', // Indigo-600
      fontFamily: 'Hind Siliguri, sans-serif',
      showWatermark: true,
      watermarkText: 'অরিজিনাল',
      showQrCode: true,
      showPaidStamp: true,
      paidStampStatus: 'APPROVED',
      orgName: 'বাংলাদেশ পলিটেকনিক অ্যান্ড টেকনোলজি ইনস্টিটিউট',
      orgTagline: 'কারিগরি ও আধুনিক প্রযুক্তি শিক্ষায় আন্তর্জাতিক মান',
      orgAddress: 'তেজগাঁও শিল্প এলাকা, ঢাকা-১২০৮',
      orgPhone: '+৮৮০২-৮৮৮৭৭৬৬',
      orgEmail: 'academic@bpti.edu.bd',
      docNumber: 'প্রত্যয়ন স্মারক নং: বিপিটিআই/প্রশা/২০২৬/১১৯',
      docDate: '০৭ অক্টোবর ২০২৬',
      recipientName: 'মো: সাখাওয়াত হোসেন',
      recipientDesignation: 'শিক্ষার্থী / ডিপ্লোমা ইঞ্জিনিয়ার',
      candidateFather: 'মো: রফিকুল ইসলাম',
      candidateMother: 'সালেহা বেগম',
      candidateRollOrId: 'রেজিস্ট্রেশন নং: ৮৪১৯২৫ (সেশন: ২০২১-২২)',
      memoSubject: 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং বিভাগে পাঠ সমাপন ও চারিত্রিক প্রশংসাপত্র',
      bodyContent: 'এই মর্মে প্রত্যয়ন করা যাইতেছে যে, জনাব মো: সাখাওয়াত হোসেন, পিতা: মো: রফিকুল ইসলাম এবং মাতা: সালেহা বেগম অত্র প্রতিষ্ঠানের কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং বিভাগ হইতে সাফল্যের সহিত ডিপ্লোমা কোর্স সম্পন্ন করিয়াছেন।\n\nঅত্র প্রতিষ্ঠানে অধ্যয়নকালীন সময়ে তাহার আচরণ অত্যন্ত সন্তোষজনক ও প্রশংসনীয় ছিল। সে প্রতিষ্ঠানের নিয়ম-শৃঙ্খলার প্রতি সর্বদা শ্রদ্ধাশীল ছিল এবং কোনো রাষ্ট্রবিরোধী বা শৃঙ্খলাপরিপন্থী কার্যকলাপে জড়িত ছিল না।\n\nআমি তাহার জীবনের সর্বাঙ্গীন সাফল্য ও উজ্জ্বল ভবিষ্যৎ কামনা করি।',
      notes: 'সনদটি উচ্চশিক্ষা ও কর্মসংস্থানে আবেদনকালীন ব্যবহারের জন্য ইস্যু করা হইল।',
      signatoryName: 'প্রফেসর ড. এ. কে. এম. মোস্তাফিজুর রহমান',
      signatoryTitle: 'অধ্যক্ষ ও প্রধান পরীক্ষা নিয়ন্ত্রক'
    }
  },
  {
    id: 'demo-cv-bn',
    name: 'Professional Resume & CV',
    banglaName: 'পেশাদার সিভি ও জীবনবৃত্তান্ত',
    category: 'cv',
    description: 'চাকরি ও স্কলারশিপ আবেদনের উপযোগী আধুনিক প্রফেশনাল কারিকুলাম ভিটা',
    badgeLabel: 'সিভি / রেজুমি',
    defaultData: {
      templateType: 'cv',
      title: 'জীবনবৃত্তান্ত (CURRICULUM VITAE)',
      primaryColor: '#0f172a', // Slate-900
      fontFamily: 'Hind Siliguri, sans-serif',
      showWatermark: false,
      showQrCode: true,
      orgName: 'মো: নাজমুল হাসান',
      orgTagline: 'সিনিয়র ফুল-স্ট্যাক সফটওয়্যার ইঞ্জিনিয়ার ও টেক লিড',
      orgAddress: 'গুলশান-২, ঢাকা, বাংলাদেশ',
      orgPhone: '+৮৮০১৭০০-০০০০০১',
      orgEmail: 'nazmul.engineer@email.com',
      docNumber: 'CV-REF-2026',
      docDate: '২০২৬',
      recipientName: 'HR & Talent Acquisition Team',
      careerSummary: 'গত ৬+ বছর যাবত ফিনটেক ও এন্টারপ্রাইজ ক্লাউড সফটওয়্যার আর্কিটেকচার নিয়ে কাজ করার বাস্তব অভিজ্ঞতা। Next.js, Node.js, Python, PostgreSQL এবং মাইক্রোসার্ভিস ডিজাইনে পারদর্শী। টিম পরিচালনায় দক্ষ এবং নতুন প্রযুক্তির দ্রুত রূপান্তরে অভিজ্ঞ।',
      experiences: [
        {
          id: 'exp1',
          role: 'সিনিয়র ফুল-স্ট্যাক ইঞ্জিনিয়ার',
          company: 'নেক্সাস ক্লাউড সিস্টেমস লিমিটেড',
          duration: '২০২৩ – বর্তমান',
          description: 'ক্লাউড স্কেলেবল পেমেন্ট গেটওয়ে আর্কিটেকচার উন্নয়ন এবং কোর এপিআই সিকিউরিটি নিশ্চিতকরণ।'
        },
        {
          id: 'exp2',
          role: 'সফটওয়্যার ডেভেলপার',
          company: 'ইনোভেক্স সফটওয়্যার ল্যাব',
          duration: '২০২১ – ২০২৩',
          description: 'রিঅ্যাক্ট ফ্রন্টএন্ড এবং নোডজেএস ব্যাকএন্ড নির্ভর ইআরপি সিস্টেম তৈরির নেতৃত্ব প্রদান।'
        }
      ],
      education: [
        {
          id: 'edu1',
          degree: 'বি.এসসি ইন কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং',
          institution: 'ঢাকা প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (ডুয়েট)',
          year: '২০২০',
          result: 'সিজিপিএ: ৩.৮৫ (৪.০০ এর মধ্যে)'
        }
      ],
      skills: ['TypeScript', 'React / Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'System Design', 'Git & CI/CD'],
      notes: 'প্রয়োজনে রেফারেন্স ও প্রজেক্ট পোর্টফোলিও লিঙ্ক সরবরাহ করা সম্ভব।',
      signatoryName: 'মো: নাজমুল হাসান',
      signatoryTitle: 'আবেদনকারী'
    }
  },
  {
    id: 'demo-memo-bn',
    name: 'Official Administrative Notice & Memo',
    banglaName: 'অফিস আদেশ ও প্রশাসনিক স্মারকপত্র',
    category: 'memo',
    description: 'কোম্পানি, দপ্তর বা শিক্ষা প্রতিষ্ঠানের সার্কুলার, নোটিশ বা প্রশাসনিক নির্দেশনা',
    badgeLabel: 'অফিস আদেশ / মেমো',
    defaultData: {
      templateType: 'memo',
      title: 'জরুরি অফিস আদেশ',
      primaryColor: '#b45309', // Amber-700
      fontFamily: 'Hind Siliguri, sans-serif',
      showWatermark: true,
      watermarkText: 'অফিসিয়াল',
      showQrCode: true,
      orgName: 'কর্ণফুলী এন্টারপ্রাইজ গ্রুপ অব ইন্ডাস্ট্রিজ',
      orgTagline: 'প্রধান প্রশাসনিক কার্যালয় · মানবসম্পদ বিভাগ',
      orgAddress: 'আগ্রাবাদ বাণিজ্যিক এলাকা, চট্টগ্রাম-৪১০০',
      orgPhone: '+৮৮০৩১-৭১৪৫২২',
      orgEmail: 'hr@karnafuligroup.com',
      docNumber: 'স্মারক নং: কেইজি/এইচআর/২০২৬/৩২৮',
      docDate: '০৭ অক্টোবর ২০২৬',
      recipientName: 'সকল বিভাগীয় প্রধান ও কর্মকর্তা-কর্মচারীবৃন্দ',
      memoSubject: 'আসন্ন বার্ষিক কর্মপরিকল্পনা পর্যালোচনা সভা ও ডিজিটাল রিপোর্টিং সংক্রান্ত',
      bodyContent: 'সংশ্লিষ্ট সকলের অবগতির জন্য জানানো যাইতেছে যে, আগামী ১৫ অক্টোবর ২০২৬ তারিখ সকাল ১০:০০ ঘটিকায় প্রধান কার্যালয়ের কনফারেন্স হলে প্রতিষ্ঠানের ২০২৬-২৭ অর্থবছরের বার্ষিক কর্মপরিকল্পনা পর্যালোচনা সভা অনুষ্ঠিত হইবে।\n\nউক্ত সভায় সকল বিভাগীয় প্রধানগণকে স্ব-স্ব বিভাগের বিগত ত্রৈমাসিক কার্যবিবরণী ও অগ্রগতি প্রতিবেদন প্রস্তুত করিয়া যথাসময়ে উপস্থিত থাকার নির্দেশ প্রদান করা হইল।\n\nউল্লেখ্য, সকল প্রতিবেদন আগামী ১২ অক্টোবর ২০২৬ তারিখ বিকাল ৫:০০ ঘটিকার মধ্যে ইমেইলের মাধ্যমে এইচআর বিভাগে জমা প্রদান নিশ্চিত করিতে হইবে।',
      terms: 'উক্ত আদেশ অবিলম্বে কার্যকর হইবে এবং কর্তৃপক্ষের অনুমতি ব্যতিরেকে কোনো ছুটি মঞ্জুর করা হইবে না।',
      signatoryName: 'কর্নেল (অব.) কাজী ইফতেখার আহমেদ',
      signatoryTitle: 'মহাব্যবস্থাপক (প্রশাসন ও মানবসম্পদ)'
    }
  }
];

export const COLOR_PRESETS = [
  { name: 'আকাশী নীল (Ocean Sky)', hex: '#0284c7' },
  { name: 'পান্না সবুজ (Emerald)', hex: '#059669' },
  { name: 'রয়েল ইন্ডিগো (Royal Indigo)', hex: '#4f46e5' },
  { name: 'ক্লাসিক নেভি (Dark Navy)', hex: '#0f172a' },
  { name: 'মেপল অ্যাম্বার (Amber)', hex: '#b45309' },
  { name: 'রুবি লাল (Crimson Red)', hex: '#be123c' },
  { name: 'টিপিক্যাল পার্পল (Plum Purple)', hex: '#7e22ce' },
  { name: 'স্লেট কাঠকয়লা (Charcoal Slate)', hex: '#334155' }
];

export const INITIAL_RECENT_DOCS: DocumentData[] = [
  {
    ...INITIAL_DEMO_TEMPLATES[0].defaultData as DocumentData,
    id: 'doc-001',
    templateId: 'demo-invoice-bn',
    title: 'প্রাইম লজিস্টিকস চালান #০৮৯',
    createdAt: '০৭ অক্টোবর ২০২৬, সকাল ১০:১৫',
    updatedAt: '০৭ অক্টোবর ২০২৬, সকাল ১০:১৫',
    downloadCount: 3
  },
  {
    ...INITIAL_DEMO_TEMPLATES[1].defaultData as DocumentData,
    id: 'doc-002',
    templateId: 'demo-receipt-bn',
    title: 'বেগম নাসরিন আক্তার কল্যাণ রশিদ #৪৪২',
    createdAt: '০৬ অক্টোবর ২০২৬, বিকাল ০৩:৪৫',
    updatedAt: '০৬ অক্টোবর ২০২৬, বিকাল ০৩:৪৫',
    downloadCount: 1
  },
  {
    ...INITIAL_DEMO_TEMPLATES[2].defaultData as DocumentData,
    id: 'doc-003',
    templateId: 'demo-certificate-bn',
    title: 'মো: সাখাওয়াত হোসেন চারিত্রিক প্রশংসাপত্র',
    createdAt: '০৫ অক্টোবর ২০২৬, দুপুর ০১:২০',
    updatedAt: '০৫ অক্টোবর ২০২৬, দুপুর ০১:২০',
    downloadCount: 4
  }
];
