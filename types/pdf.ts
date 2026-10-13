export type TemplateCategory = 'invoice' | 'receipt' | 'certificate' | 'cv' | 'memo' | 'custom';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface DocumentData {
  id: string;
  templateId: string;
  templateType: TemplateCategory;
  title: string;
  createdAt: string;
  updatedAt: string;
  downloadCount: number;
  
  // Customization
  primaryColor: string;
  fontFamily: string;
  showWatermark: boolean;
  watermarkText?: string;
  showQrCode: boolean;
  showPaidStamp?: boolean;
  paidStampStatus?: 'PAID' | 'DUE' | 'APPROVED' | 'VERIFIED';
  
  // Header / Organization
  orgName: string;
  orgTagline?: string;
  orgAddress?: string;
  orgPhone?: string;
  orgEmail?: string;
  orgLogoUrl?: string;
  
  // Document identifiers
  docNumber: string;
  docDate: string;
  dueDate?: string;
  
  // Recipient / Client / Candidate
  recipientName: string;
  recipientDesignation?: string;
  recipientOrg?: string;
  recipientAddress?: string;
  recipientPhone?: string;
  recipientEmail?: string;
  
  // Invoice / Receipt Specific
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  taxPercent: number;
  taxAmount: number;
  paidAmount: number;
  dueAmount: number;
  currency: string;
  amountInWords?: string;
  paymentMethod?: string;
  transactionId?: string;
  
  // Certificate / Memo Specific
  memoSubject?: string;
  bodyContent?: string;
  candidateRollOrId?: string;
  candidateFather?: string;
  candidateMother?: string;
  candidateSession?: string;
  candidateGpaOrResult?: string;
  
  // CV / Resume Specific
  careerSummary?: string;
  experiences?: {
    id: string;
    role: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education?: {
    id: string;
    degree: string;
    institution: string;
    year: string;
    result: string;
  }[];
  skills?: string[];
  
  // Footer / Signatory
  notes?: string;
  terms?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  signatureUrl?: string;
  
  // If generated from uploaded PDF demo
  uploadedPdfSource?: {
    fileName: string;
    fileSize: number;
    previewUrl?: string;
    uploadedAt: string;
  };
  customFields?: {
    id: string;
    label: string;
    value: string;
  }[];
}

export interface DemoTemplate {
  id: string;
  name: string;
  banglaName: string;
  category: TemplateCategory;
  description: string;
  isCustomUploaded?: boolean;
  uploadedPdfUrl?: string;
  originalFileName?: string;
  defaultData: Partial<DocumentData>;
  badgeLabel: string;
}
