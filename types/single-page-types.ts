export type ActiveOption = 'Form' | 'Nid' | 'Proff';

export interface FormCorrectionItem {
  id: string;
  subject: string;
  currentData: string;
  correctedData: string;
  attachment: string;
}

export interface FormDataState {
  // ফরম-২: জাতীয় পরিচয়পত্র বা তথ্য-উপাত্ত সংশোধনের আবেদন
  serialNo: string;
  applicantName: string;
  applicantNid: string;
  guardianName?: string;
  guardianNid?: string;
  
  // সংশোধনের টেবিল
  corrections: FormCorrectionItem[];
  
  // ফি ও রশিদ
  feeAmount: string;
  feeReceiptNo: string;
  attachedDocsSummary: string;
  
  // আবেদনকারীর যোগাযোগ
  applicantAddress: string;
  applicantMobile: string;
  applicantEmail: string;
  
  // অভিভাবকের যোগাযোগ (প্রযোজ্য ক্ষেত্রে)
  guardianAddress?: string;
  guardianMobile?: string;
  guardianEmail?: string;
  
  // অংশ - খ (রসিদ)
  applicationDate: string;
  deliveryDate: string;
  receiptSerialNo?: string;
  applicantSignName?: string;
  receiptApplicantName?: string;
  receiptGuardianName?: string;
  receiptAppDate?: string;
  receiptDeliveryDate?: string;
}

export interface NidDataState {
  nameBangla: string;
  nameEnglish: string;
  fatherName: string;
  motherName: string;
  dob: string;
  nidNumber: string;
  pinNumber?: string;
  bloodGroup: string;
  birthPlace: string;
  issueDate: string;
  address: string;
  photoUrl?: string;
  signatureUrl?: string;
  cardType?: 'smart' | 'paper';
  layout?: 'side-by-side' | 'stacked';
  showCutGuides?: boolean;
  watermarkOpacity?: number;
}

export interface ProffDataState {
  instituteName: string;
  instituteAddress: string;
  institutePhone: string;
  refNo: string;
  date: string;
  subject: string;
  personName: string;
  relationFather: string;
  relationMother: string;
  address: string;
  proofStatement: string;
  authorityName: string;
  authorityDesignation: string;
  signatureUrl?: string;
  sealText: string;
}

export interface GeneratedDocItem {
  id: string;
  type: ActiveOption;
  title: string;
  docNumber: string;
  createdAt: string;
  downloadCount: number;
}
