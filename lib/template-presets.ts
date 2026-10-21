import type {TemplateField} from '@/types/template';

/**
 * Built-in templates bundled with the app.
 *
 * The Form-2 preset ships the official Election Commission correction form
 * as a blank template PDF (public/templates/form2-official.pdf — the sample's
 * filled values were removed, so no personal data is bundled) with every
 * fillable position pre-mapped from the original document's text layout.
 * Positions are PDF points, origin = top-left, page = A4 (595 × 842).
 */
export interface TemplatePreset {
  id: string;
  title: string;
  /** Path inside public/, without leading slash */
  pdfPath: string;
  fields: Array<Omit<TemplateField, 'id'>>;
}

type FieldSpec = [name: string, x: number, y: number, w: number, h: number, fontSize: number];

const spec = (s: FieldSpec): Omit<TemplateField, 'id'> => ({
  name: s[0],
  page: 0,
  x: s[1],
  y: s[2],
  w: s[3],
  h: s[4],
  fontSize: s[5],
  font: 'solaiman',
  color: '#000000',
  cover: false,
});

export const FORM2_PRESET: TemplatePreset = {
  id: 'form2-official',
  title: 'অফিসিয়াল ফরম-২ (সংশোধন আবেদন)',
  pdfPath: 'templates/form2-official.pdf',
  fields: ([
    ['ক্রমিক নম্বর', 450, 102, 95, 15, 10],
    ['নাম', 188, 143, 350, 15, 10],
    ['জাতীয় পরিচিতি নম্বর (NID)', 188, 163, 350, 15, 10],
    ['অভিভাবকের নাম', 188, 203, 350, 15, 10],
    ['অভিভাবকের জাতীয় পরিচিতি নম্বর', 188, 223, 350, 15, 10],
    ['বিষয়', 52, 311, 114, 14, 8],
    ['বর্তমান তথ্য', 172, 311, 126, 14, 8],
    ['সংশোধিত তথ্য', 302, 311, 126, 14, 8],
    ['দলিলাদি / মন্তব্য', 432, 311, 111, 14, 10],
    ['অভিভাবকের নাম (স্বাক্ষর অংশ)', 73, 543, 168, 13, 10],
    ['অভিভাবকের ঠিকানা', 83, 558, 158, 13, 10],
    ['অভিভাবকের মোবাইল নম্বর', 108, 573, 133, 13, 10],
    ['অভিভাবকের ই-মেইল', 132, 588, 109, 13, 10],
    ['আবেদনকারীর নাম (স্বাক্ষর অংশ)', 393, 543, 150, 13, 10],
    ['রশিদ: ক্রমিক নম্বর', 450, 652, 95, 15, 10],
    ['রশিদ: আবেদনকারীর নাম ও NID', 307, 671, 236, 15, 10],
    ['রশিদ: অভিভাবকের নাম ও NID', 307, 688, 236, 15, 10],
  ] as FieldSpec[]).map(spec),
};

// The receipt (অংশ-খ) serial is always the same as the form's serial number,
// and the official printed form leaves the fee/receipt/attachment lines, the
// applicant's contact lines and the receipt dates blank — so the preset has
// no fields for them (they can still be added by hand in the field editor).
FORM2_PRESET.fields = FORM2_PRESET.fields.map((f) =>
  f.name === 'রশিদ: ক্রমিক নম্বর' ? {...f, mirrorOf: 'ক্রমিক নম্বর'} : f,
);


/**
 * The official NID card (front + back side by side on one Letter page,
 * 612x792pt), as downloaded from the EC portal. The bundled PDF is that
 * card with every personal value, the photo, both signatures and the
 * PDF417 barcode removed — only the card frame, labels, emblem and
 * watermark remain. Positions were measured from the original's text
 * spans; values land exactly where the portal prints them (name and ID
 * number bold; date of birth, ID number and blood group red). The photo
 * and signature areas stay blank: template fields are text-only, so a
 * card that needs a photo still goes through the built-in NID maker.
 */
const nf = (
  name: string,
  x: number,
  y: number,
  w: number,
  h: number,
  fontSize: number,
  font: TemplateField['font'],
  color = '#000000',
  bold = false,
): Omit<TemplateField, 'id'> => ({
  name, page: 0, x, y, w, h, fontSize, font, color, cover: false, ...(bold ? {bold: true} : {}),
});

export const NID_PRESET: TemplatePreset = {
  id: 'nid-card-official',
  title: 'অফিসিয়াল NID কার্ড',
  pdfPath: 'templates/nid-card-official.pdf',
  fields: [
    // front
    nf('নাম', 144, 104.5, 150, 17, 12, 'solaiman', '#000000', true),
    nf('Name (English)', 144, 127, 150, 15, 10, 'hind', '#000000', true),
    nf('পিতা', 144, 141, 150, 15, 10, 'solaiman'),
    nf('মাতা', 144, 157, 150, 15, 10, 'solaiman'),
    nf('Date of Birth', 169, 174, 115, 13, 9, 'hind', '#ff0000'),
    nf('ID NO', 143, 187.5, 120, 13, 9, 'hind', '#ff0000', true),
    // back
    nf('ঠিকানা', 331, 80, 212, 22, 9, 'solaiman'),
    nf('রক্তের গ্রুপ', 383, 122.5, 26, 11, 8, 'hind', '#ff0000'),
    nf('জন্মস্থান', 423, 120, 100, 12, 8, 'solaiman'),
    nf('প্রদানের তারিখ', 489, 153.5, 44, 13, 9, 'solaiman'),
  ],
};

export const TEMPLATE_PRESETS: TemplatePreset[] = [FORM2_PRESET, NID_PRESET];
