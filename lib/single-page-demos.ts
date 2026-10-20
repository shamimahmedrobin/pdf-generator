import { FormDataState, GeneratedDocItem, NidDataState, ProffDataState } from '@/types/single-page-types';

export const DEFAULT_FORM_DATA: FormDataState = {
  serialNo: 'NIDCA5002923842',
  applicantName: 'মোঃ রবিউল্লাহ',
  applicantNid: '8732934032',
  guardianName: '',
  guardianNid: '',
  corrections: [
    {
      id: '1',
      subject: '(০১) জন্ম তারিখ',
      currentData: '২৫/০৪/১৯৯৪',
      correctedData: '২৫/০৩/১৯৯৪',
      attachment: 'BIRTH_CERTIFICATE'
    }
  ],
  feeAmount: '৩৪৫/-',
  feeReceiptNo: 'TR-9832410',
  attachedDocsSummary: 'জন্ম নিবন্ধন সনদ ও জাতীয় পরিচয়পত্রের কপি',
  applicantAddress: 'বাড়ি #১২, রোড #০৪, সেক্টর #১০, উত্তরা, ঢাকা',
  applicantMobile: '০১৭১২-৩৪৫৬৭৮',
  applicantEmail: 'rabiullah@example.com',
  guardianAddress: '',
  guardianMobile: '',
  guardianEmail: '',
  applicationDate: '০৭/১০/২০২৬',
  deliveryDate: '১৫/১১/২০২৬',
  receiptSerialNo: 'REC-2026-842'
};

export const DEFAULT_NID_DATA: NidDataState = {
  nameBangla: 'মোঃ তাওহীদুল ইসলাম নাহিদ',
  nameEnglish: 'MD TAWHIDUL ISLAM NAHID',
  fatherName: 'মোঃ নুরুল মুত্তাকিন',
  motherName: 'রেশমা আক্তার',
  dob: '12 Sep 2006',
  nidNumber: '1533151575',
  pinNumber: '19948732934032',
  bloodGroup: 'A+',
  birthPlace: 'সুনামগঞ্জ',
  issueDate: '০৪/১০/২০২৩',
  address: 'গ্রাম/রাস্তা: নয়া শুকদেবপুর, দামোধরপুর, ডাকঘর: জয়নগর বাজার - ৩০০০, জামালগঞ্জ, সুনামগঞ্জ',
  cardType: 'paper',
  layout: 'side-by-side',
  showCutGuides: false,
  watermarkOpacity: 0.12
};

export const DEFAULT_PROFF_DATA: ProffDataState = {
  instituteName: 'ঢাকা উত্তর সিটি কর্পোরেশন · আঞ্চলিক কার্যালয়',
  instituteAddress: 'সেক্টর-৩, উত্তরা মডেল টাউন, ঢাকা-১২৩০',
  institutePhone: '+৮৮০২-৮৯০১২২৩',
  refNo: 'ডিএনসিসি/প্রত্যয়ন/২০২৬/৮৪২',
  date: '০৭ অক্টোবর ২০২৬',
  subject: 'স্থায়ী নাগরিকত্ব ও চারিত্রিক প্রত্যয়ন পত্র (Proof of Citizenship & Conduct)',
  personName: 'মোঃ রবিউল্লাহ',
  relationFather: 'আব্দুল কাদের',
  relationMother: 'জাহানারা বেগম',
  address: 'বাড়ি #০৭, রোড #০৯, রামপুরা, ঢাকা',
  proofStatement: 'এই মর্মে প্রত্যয়ন করা যাইতেছে যে, মোঃ রবিউল্লাহ, পিতা: আব্দুল কাদের ও মাতা: জাহানারা বেগম অত্র এলাকার একজন স্থায়ী ও সুপরিচিত নাগরিক।\n\nআমার জানামতে তাহার চরিত্র ভালো এবং তিনি কোনো সমাজবিরোধী বা রাষ্ট্রবিরোধী কার্যকলাপে জড়িত নন। তিনি একজন দায়িত্বশীল নাগরিক।\n\nআমি তাহার ভবিষ্যৎ জীবনের সর্বাঙ্গীন উন্নতি ও সাফল্য কামনা করি।',
  authorityName: 'কাউন্সিলর মো: রফিকুল ইসলাম',
  authorityDesignation: 'ওয়ার্ড কাউন্সিলর (ওয়ার্ড নং ০১)',
  sealText: 'কর্তৃপক্ষ কর্তৃক যাচাইকৃত ও অনুমোদিত'
};

export const DEFAULT_GENERATED_DOCS: GeneratedDocItem[] = [
  {
    id: 'doc-1',
    type: 'Form',
    title: 'নাগরিক সেবা আবেদন ফরম',
    docNumber: 'APP-২০২৬-৮৮৯',
    createdAt: '০৭ অক্টোবর ২০২৬',
    downloadCount: 2
  },
  {
    id: 'doc-2',
    type: 'Nid',
    title: 'জাতীয় পরিচয়পত্র (NID) কার্ড প্রিন্ট',
    docNumber: '645 289 1045',
    createdAt: '০৭ অক্টোবর ২০২৬',
    downloadCount: 4
  },
  {
    id: 'doc-3',
    type: 'Proff',
    title: 'স্থায়ী নাগরিকত্ব ও চারিত্রিক প্রত্যয়ন পত্র',
    docNumber: 'ডিএনসিসি/প্রত্যয়ন/২০২৬/৮৪২',
    createdAt: '০৬ অক্টোবর ২০২৬',
    downloadCount: 1
  }
];
