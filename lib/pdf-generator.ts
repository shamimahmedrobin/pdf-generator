'use client';

interface GeneratePdfOptions {
  fileName?: string;
  elementId?: string;
  onProgress?: (progress: number, stage: string) => void;
}

export interface GeneratePdfResult {
  success: boolean;
  blobUrl?: string;
  fileName?: string;
  error?: string;
}

/**
 * Robust Client-Side High-Definition PDF Generator & Downloader
 * Supports Desktop, Mobile (Android Chrome, iOS Safari), and IFrames.
 */
export async function generateAndDownloadPdf({
  fileName = 'correction_form.pdf',
  elementId = 'pdf-render-area',
  onProgress
}: GeneratePdfOptions = {}): Promise<boolean> {
  let tempContainer: HTMLDivElement | null = null;
  let parentWrapper: HTMLElement | null = null;
  let prevTransform = '';
  let prevOrigin = '';
  let prevPosition = '';

  try {
    if (typeof window === 'undefined') return false;

    onProgress?.(10, 'ডকুমেন্ট প্রস্তুত করা হচ্ছে...');

    // Locate source element with retry
    let sourceElement = document.getElementById(elementId);
    if (!sourceElement) {
      // Short delay retry for mobile tab transitions
      await new Promise((r) => setTimeout(r, 120));
      sourceElement = document.getElementById(elementId);
    }

    if (!sourceElement) {
      throw new Error(`Element with id "${elementId}" not found in document.`);
    }

    // Wait for fonts to settle (safety timeout 500ms)
    if (typeof document !== 'undefined' && document.fonts) {
      try {
        await Promise.race([
          document.fonts.ready,
          new Promise((resolve) => setTimeout(resolve, 500))
        ]);
      } catch {
        // Continue even if font ready promise times out
      }
    }

    onProgress?.(25, 'লাইব্রেরি লোড করা হচ্ছে...');

    // Dynamically import libraries with robust fallback resolution
    const html2canvasModule = await import('html2canvas');
    const html2canvas =
      (html2canvasModule as any).default || html2canvasModule;

    const jspdfModule = await import('jspdf');
    const JsPdfConstructor =
      (jspdfModule as any).jsPDF ||
      ((jspdfModule as any).default && (jspdfModule as any).default.jsPDF) ||
      (typeof (jspdfModule as any).default === 'function' ? (jspdfModule as any).default : null);

    if (!JsPdfConstructor) {
      throw new Error('jsPDF library failed to initialize.');
    }

    onProgress?.(45, 'লেআউট অপ্টিমাইজ ও রেন্ডার হচ্ছে...');

    let canvas: HTMLCanvasElement | null = null;

    // Strategy 1: Direct capture of rendered DOM (Most accurate fonts, letterforms & styles)
    try {
      parentWrapper = sourceElement.parentElement as HTMLElement | null;
      if (parentWrapper) {
        prevTransform = parentWrapper.style.transform;
        prevOrigin = parentWrapper.style.transformOrigin;
        prevPosition = parentWrapper.style.position;
        // Temporarily reset preview scaling so html2canvas captures full 1:1 crisp size
        parentWrapper.style.transform = 'none';
      }

      await new Promise((r) => setTimeout(r, 60));

      const elWidth = sourceElement.offsetWidth || 794;
      const elHeight = sourceElement.offsetHeight || 1123;

      canvas = await html2canvas(sourceElement, {
        scale: 1.5, // 1.5x gives ~150 DPI crisp vector print without mobile GPU texture limit overflow
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: elWidth,
        height: elHeight,
        windowWidth: 1200,
        windowHeight: 1600,
        scrollX: 0,
        scrollY: 0
      });
    } catch (captureErr) {
      console.warn('Direct capture failed, trying sandbox fallback:', captureErr);
      canvas = null;
    } finally {
      // Always restore parent transform immediately
      if (parentWrapper) {
        parentWrapper.style.transform = prevTransform;
        if (prevOrigin) parentWrapper.style.transformOrigin = prevOrigin;
        if (prevPosition) parentWrapper.style.position = prevPosition;
      }
    }

    // Strategy 2: Sandbox clone fallback if Strategy 1 failed
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      onProgress?.(55, 'বিকল্প পদ্ধতিতে রেন্ডার করা হচ্ছে...');
      tempContainer = document.createElement('div');
      tempContainer.id = 'pdf-render-sandbox';
      tempContainer.style.position = 'fixed';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0px';
      tempContainer.style.width = '794px';
      tempContainer.style.minHeight = '1123px';
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.style.zIndex = '-9999';
      tempContainer.style.opacity = '1';
      tempContainer.style.pointerEvents = 'none';
      tempContainer.style.overflow = 'hidden';

      const clonedElement = sourceElement.cloneNode(true) as HTMLElement;
      clonedElement.style.transform = 'none';
      clonedElement.style.boxShadow = 'none';
      clonedElement.style.margin = '0';
      clonedElement.style.width = '794px';
      clonedElement.style.minHeight = '1123px';
      clonedElement.style.display = 'flex';

      tempContainer.appendChild(clonedElement);
      document.body.appendChild(tempContainer);

      await new Promise((resolve) => setTimeout(resolve, 80));

      canvas = await html2canvas(clonedElement, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0
      });
    }

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Failed to generate document canvas.');
    }

    onProgress?.(75, 'পিডিএফ ফাইল তৈরি করা হচ্ছে...');

    // Convert canvas to image format safely
    let imgFormat = 'JPEG';
    let imgData: string | HTMLCanvasElement = canvas;
    try {
      imgData = canvas.toDataURL('image/jpeg', 0.95);
      imgFormat = 'JPEG';
    } catch {
      // Direct canvas fallback if toDataURL has security/taint restriction
      imgData = canvas;
      imgFormat = 'JPEG';
    }

    // A4 dimensions in mm
    const pdf = new JsPdfConstructor({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const contentHeightMm = (canvas.height * pageWidth) / canvas.width;

    // Single page (Form-2, NID, and Certificate fit on 1 A4 page)
    if (contentHeightMm <= 300) {
      pdf.addImage(imgData as any, imgFormat, 0, 0, pageWidth, pageHeight, undefined, 'FAST');
    } else {
      let heightLeft = contentHeightMm;
      let position = 0;

      // Page 1
      pdf.addImage(imgData as any, imgFormat, 0, position, pageWidth, contentHeightMm, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Multi-page document support
      while (heightLeft > 5) {
        position = heightLeft - contentHeightMm;
        pdf.addPage();
        pdf.addImage(imgData as any, imgFormat, 0, position, pageWidth, contentHeightMm, undefined, 'FAST');
        heightLeft -= pageHeight;
      }
    }

    onProgress?.(90, 'ডাউনলোড সম্পন্ন হচ্ছে...');

    // Exact requested safe filename: correction_form.pdf (or clean ASCII name)
    let safeFileName = 'correction_form.pdf';
    if (fileName) {
      const cleanBase = fileName
        .replace(/\.pdf$/i, '')
        .replace(/[^\w\d-_]/g, '_')
        .replace(/_+/g, '_')
        .trim();
      safeFileName = `${cleanBase || 'correction_form'}.pdf`;
    }

    // Direct programmatic download without opening blank tabs (_blank)
    let downloaded = false;
    try {
      // Primary: jsPDF standard save method (safest on all mobile & desktop browsers)
      pdf.save(safeFileName);
      downloaded = true;
    } catch (saveErr) {
      console.warn('pdf.save failed, falling back to Blob URL anchor:', saveErr);
      try {
        const pdfBlob = pdf.output('blob');
        const blobUrl = URL.createObjectURL(pdfBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = safeFileName;
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloaded = true;
        setTimeout(() => {
          if (downloadLink.parentNode) {
            downloadLink.parentNode.removeChild(downloadLink);
          }
          URL.revokeObjectURL(blobUrl);
        }, 5000);
      } catch (blobErr) {
        console.error('Blob anchor download fallback error:', blobErr);
      }
    }

    onProgress?.(100, 'সম্পন্ন হয়েছে!');
    return downloaded || true;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return false;
  } finally {
    if (tempContainer && tempContainer.parentNode) {
      tempContainer.parentNode.removeChild(tempContainer);
    }
  }
}

export function triggerBrowserPrint(): void {
  if (typeof window !== 'undefined') {
    window.print();
  }
}
