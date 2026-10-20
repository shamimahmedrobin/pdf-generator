import type {
  FormDataState,
  GeneratedDocItem,
  NidDataState,
  ProffDataState,
} from '@/types/single-page-types';

export type SelectedFont = 'sutonny' | 'kalpurush' | 'solaiman' | 'hind';

export const STORAGE_KEYS = {
  form: 'pdf_form_data',
  nid: 'pdf_nid_data',
  proff: 'pdf_proff_data',
  history: 'pdf_generated_history',
  font: 'pdf_selected_font',
} as const;

/** Write a JSON-serializable value to localStorage, ignoring quota/privacy errors. */
export function writeLocal(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable (private mode) — the app keeps working in-memory.
  }
}

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/**
 * Strip legacy placeholder correction rows left over from the old 7-row demo:
 * rows that carry no content at all are dropped, and a solitary auto-prefix
 * subject (e.g. "(০২)") on an otherwise empty row is cleared.
 */
export function cleanLegacyCorrections(data: FormDataState): FormDataState {
  if (!Array.isArray(data?.corrections)) return data;

  const filtered = data.corrections
    .filter(
      (r) =>
        (r.subject && r.subject.trim() !== '') ||
        (r.currentData && r.currentData.trim() !== '') ||
        (r.correctedData && r.correctedData.trim() !== '') ||
        (r.attachment && r.attachment.trim() !== '') ||
        r.id === '1'
    )
    .map((r) => {
      const hasCorrection = Boolean(
        (r.currentData && r.currentData.trim() !== '') ||
          (r.correctedData && r.correctedData.trim() !== '')
      );
      if (!hasCorrection && r.subject && r.subject.match(/^\(০[০-৯]\)\s*$/)) {
        return {...r, subject: ''};
      }
      return r;
    });

  return {
    ...data,
    corrections: filtered.length > 0 ? filtered : data.corrections,
  };
}

export interface PersistedState {
  formData?: FormDataState;
  nidData?: NidDataState;
  proffData?: ProffDataState;
  generatedDocs?: GeneratedDocItem[];
  selectedFont?: SelectedFont;
}

const VALID_FONTS: SelectedFont[] = ['sutonny', 'kalpurush', 'solaiman', 'hind'];

/** Load everything the app persists in localStorage. Missing keys stay undefined. */
export function loadPersistedState(): PersistedState {
  const state: PersistedState = {};

  const form = readJson<FormDataState>(STORAGE_KEYS.form);
  if (form) state.formData = cleanLegacyCorrections(form);

  const nid = readJson<NidDataState>(STORAGE_KEYS.nid);
  if (nid) state.nidData = nid;

  const proff = readJson<ProffDataState>(STORAGE_KEYS.proff);
  if (proff) state.proffData = proff;

  const history = readJson<GeneratedDocItem[]>(STORAGE_KEYS.history);
  if (history) state.generatedDocs = history;

  try {
    const font = localStorage.getItem(STORAGE_KEYS.font);
    if (font && VALID_FONTS.includes(font as SelectedFont)) {
      state.selectedFont = font as SelectedFont;
    }
  } catch {
    // ignore — default font applies
  }

  return state;
}
