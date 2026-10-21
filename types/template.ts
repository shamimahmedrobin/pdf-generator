export type TemplateFontKey = 'solaiman' | 'nikosh' | 'kalpurush' | 'hind';

export const TEMPLATE_FONTS: {key: TemplateFontKey; label: string; cssClass: string}[] = [
  {key: 'solaiman', label: 'SolaimanLipi', cssClass: 'font-solaiman'},
  {key: 'nikosh', label: 'Nikosh (Sutonny স্টাইল)', cssClass: 'font-nikosh'},
  {key: 'kalpurush', label: 'Kalpurush', cssClass: 'font-kalpurush'},
  {key: 'hind', label: 'Hind Siliguri', cssClass: 'font-hind'},
];

export interface TemplateField {
  id: string;
  /** Label shown in the fill form */
  name: string;
  /** 0-based page index */
  page: number;
  /** Position/size in PDF points, origin = top-left of the page */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Font size in points */
  fontSize: number;
  font: TemplateFontKey;
  /** Hex color, e.g. #000000 */
  color: string;
  /** Paint an opaque white patch behind the text (covers the old value) */
  cover: boolean;
  /** Name of another field whose value this field reuses (e.g. the receipt copy of a serial number). Mirror fields get no input of their own. */
  mirrorOf?: string;
}

export interface PdfTemplateMeta {
  id: string;
  name: string;
  createdAt: number;
  pageCount: number;
  /** Page size in points of the first page (all pages are rendered individually anyway) */
  pageWidth: number;
  pageHeight: number;
  fields: TemplateField[];
}
