import type {PdfTemplateMeta} from '@/types/template';

/**
 * Template persistence:
 * - Metadata + field definitions live in localStorage (small).
 * - The original PDF bytes live in IndexedDB (localStorage is too small for PDFs).
 */

const META_KEY = 'pdf_templates_meta';
const DB_NAME = 'pdf-generator-db';
const DB_STORE = 'template-files';

export function loadTemplateMetas(): PdfTemplateMeta[] {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTemplateMetas(metas: PdfTemplateMeta[]): void {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(metas));
  } catch {
    // Quota exceeded — metadata is small, so this is unlikely; ignore silently.
  }
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(DB_STORE)) {
        req.result.createObjectStore(DB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbRequest<T>(run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(DB_STORE, 'readwrite');
        const req = run(tx.objectStore(DB_STORE));
        req.onsuccess = () => {
          db.close();
          resolve(req.result);
        };
        req.onerror = () => {
          db.close();
          reject(req.error);
        };
      })
  );
}

export function savePdfBytes(id: string, bytes: ArrayBuffer): Promise<void> {
  return idbRequest((store) => store.put(bytes, id)).then(() => undefined);
}

export function loadPdfBytes(id: string): Promise<ArrayBuffer | null> {
  return idbRequest<ArrayBuffer | undefined>((store) => store.get(id)).then(
    (v) => v ?? null
  );
}

export function deletePdfBytes(id: string): Promise<void> {
  return idbRequest((store) => store.delete(id)).then(() => undefined);
}

/** Unique id for templates/fields (kept here so components stay pure). */
export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}

export function nowMs(): number {
  return Date.now();
}
