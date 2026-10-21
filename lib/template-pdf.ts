'use client';

import {PDFDocument, rgb} from 'pdf-lib';
import type {PDFDocumentProxy, PDFPageProxy} from 'pdfjs-dist';
import type {TemplateField} from '@/types/template';
import {TEMPLATE_FONTS} from '@/types/template';

/**
 * PDF template engine.
 *
 * The original PDF page is kept untouched as the visual base (so the output
 * looks exactly like the source document). Filled values are rendered to
 * transparent PNGs with the browser's text engine — which shapes Bengali
 * conjuncts correctly — and placed over the page with pdf-lib, optionally
 * on top of an opaque white patch that covers the previous value.
 */

let pdfjsPromise: Promise<typeof import('pdfjs-dist')> | null = null;

function loadPdfJs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import('pdfjs-dist').then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString();
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

export async function openPdf(bytes: ArrayBuffer): Promise<PDFDocumentProxy> {
  const pdfjs = await loadPdfJs();
  // pdf.js detaches the buffer it is given — always hand it a copy.
  return pdfjs.getDocument({data: bytes.slice(0)}).promise;
}

export interface RenderedPage {
  canvas: HTMLCanvasElement;
  widthPt: number;
  heightPt: number;
  /** CSS pixels per PDF point at the rendered size */
  scale: number;
}

export async function renderPage(
  pdf: PDFDocumentProxy,
  pageNumber: number, // 1-based
  targetWidthPx: number
): Promise<RenderedPage> {
  const page: PDFPageProxy = await pdf.getPage(pageNumber);
  const base = page.getViewport({scale: 1});
  const scale = targetWidthPx / base.width;
  // Render at 2x for crispness, display at target width.
  const viewport = page.getViewport({scale: scale * 2});
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  canvas.style.width = `${Math.floor(base.width * scale)}px`;
  canvas.style.height = `${Math.floor(base.height * scale)}px`;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available');
  await page.render({canvas, canvasContext: ctx, viewport}).promise;
  return {canvas, widthPt: base.width, heightPt: base.height, scale};
}

/** Resolve the real font-family string behind one of the app's font classes. */
const familyCache = new Map<string, string>();
export async function resolveFontFamily(fontKey: TemplateField['font']): Promise<string> {
  const cached = familyCache.get(fontKey);
  if (cached) return cached;
  const def = TEMPLATE_FONTS.find((f) => f.key === fontKey) ?? TEMPLATE_FONTS[0];
  const probe = document.createElement('span');
  probe.className = def.cssClass;
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.textContent = 'অ';
  document.body.appendChild(probe);
  const family = getComputedStyle(probe).fontFamily || 'sans-serif';
  probe.remove();
  try {
    await document.fonts.load(`16px ${family}`, 'অ');
  } catch {
    // Font may already be usable; generation will fall back gracefully.
  }
  familyCache.set(fontKey, family);
  return family;
}

function hexToRgb(hex: string): {r: number; g: number; b: number} {
  const clean = hex.replace('#', '');
  const num = parseInt(
    clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean,
    16
  );
  return {r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255};
}

/**
 * Render one field value to a transparent PNG sized exactly like the field
 * box. Text is drawn left-aligned with its baseline ~2pt above the box
 * bottom, matching how values sit on form lines. Overlong text shrinks.
 */
async function renderValueImage(
  field: TemplateField,
  value: string
): Promise<{bytes: Uint8Array; wPt: number; hPt: number}> {
  const SCALE = 6; // px per pt (~432 dpi) — crisp in print
  const family = await resolveFontFamily(field.font);
  const wPx = Math.max(2, Math.round(field.w * SCALE));
  const hPx = Math.max(2, Math.round(field.h * SCALE));
  const canvas = document.createElement('canvas');
  canvas.width = wPx;
  canvas.height = hPx;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available');

  let fontPx = field.fontSize * SCALE;
  const setFont = () => {
    ctx.font = `${fontPx}px ${family}`;
  };
  setFont();
  const maxWidth = wPx - 1 * SCALE;
  while (fontPx > 5 * SCALE && ctx.measureText(value).width > maxWidth) {
    fontPx -= SCALE * 0.5;
    setFont();
  }
  const {r, g, b} = hexToRgb(field.color);
  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
  ctx.textBaseline = 'alphabetic';
  const baselineY = hPx - 1.5 * SCALE;
  ctx.fillText(value, 0, baselineY);

  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
  if (!blob) throw new Error('Failed to render field text');
  return {
    bytes: new Uint8Array(await blob.arrayBuffer()),
    wPt: field.w,
    hPt: field.h,
  };
}

export async function generateFromTemplate(
  pdfBytes: ArrayBuffer,
  fields: TemplateField[],
  values: Record<string, string>
): Promise<Blob> {
  const doc = await PDFDocument.load(pdfBytes.slice(0));
  const pages = doc.getPages();

  for (const field of fields) {
    const value = (values[field.id] ?? '').trim();
    if (!value) continue;
    const page = pages[field.page];
    if (!page) continue;
    const {height: pageHeight} = page.getSize();
    // Convert top-left origin → pdf-lib bottom-left origin
    const yBottom = pageHeight - field.y - field.h;

    if (field.cover) {
      page.drawRectangle({
        x: field.x,
        y: yBottom,
        width: field.w,
        height: field.h,
        color: rgb(1, 1, 1),
      });
    }

    const img = await renderValueImage(field, value);
    const png = await doc.embedPng(img.bytes);
    page.drawImage(png, {x: field.x, y: yBottom, width: img.wPt, height: img.hPt});
  }

  const out = await doc.save();
  return new Blob([out.buffer as ArrayBuffer], {type: 'application/pdf'});
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 5000);
}
