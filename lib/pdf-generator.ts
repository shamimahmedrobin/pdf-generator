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
  let sandboxContainer: HTMLDivElement | null = null;

  try {
    if (typeof window === 'undefined') return false;

    onProgress?.(10, 'ডকুমেন্ট প্রস্তুত করা হচ্ছে...');

    // Locate source element with retry for smooth tab switching
    let sourceElement = document.getElementById(elementId);
    if (!sourceElement) {
      await new Promise((r) => setTimeout(r, 120));
      sourceElement = document.getElementById(elementId);
    }

    if (!sourceElement) {
      throw new Error(`Element "${elementId}" not found.`);
    }

    // Wait for document fonts to settle
    if (typeof document !== 'undefined' && document.fonts) {
      try {
        await Promise.race([
          document.fonts.ready,
          new Promise((resolve) => setTimeout(resolve, 300))
        ]);
      } catch {
        // Continue even if font ready promise times out
      }
    }

    onProgress?.(25, 'লাইব্রেরি লোড করা হচ্ছে...');

    // Dynamically import libraries.
    // html2canvas-pro is the maintained fork of html2canvas with support for
    // the modern CSS color functions (oklch/lab) that Tailwind v4 emits.
    const {default: html2canvas} = await import('html2canvas-pro');
    const {jsPDF: JsPdfConstructor} = await import('jspdf');

    onProgress?.(45, 'লেআউট অপ্টিমাইজ ও রেন্ডার হচ্ছে...');

    // Create a pristine fixed container at (0,0) behind the dark UI (z-index: -9999)
    // This isolates the element completely from zoom/scale transforms and responsive overflow
    sandboxContainer = document.createElement('div');
    sandboxContainer.id = 'pdf-export-sandbox';
    sandboxContainer.style.position = 'fixed';
    sandboxContainer.style.top = '0px';
    sandboxContainer.style.left = '0px';
    sandboxContainer.style.width = '794px';
    sandboxContainer.style.minHeight = '1123px';
    sandboxContainer.style.backgroundColor = '#ffffff';
    sandboxContainer.style.zIndex = '-9999';
    sandboxContainer.style.opacity = '1';
    sandboxContainer.style.pointerEvents = 'none';
    sandboxContainer.style.overflow = 'visible';

    // Deep clone the source element
    const clonedElement = sourceElement.cloneNode(true) as HTMLElement;
    clonedElement.style.transform = 'none';
    clonedElement.style.boxShadow = 'none';
    clonedElement.style.margin = '0';
    clonedElement.style.width = '794px';
    clonedElement.style.minHeight = '1123px';
    clonedElement.style.display = 'flex';
    clonedElement.style.flexDirection = 'column';

    sandboxContainer.appendChild(clonedElement);
    document.body.appendChild(sandboxContainer);

    // Wait for DOM paint and layout to stabilize
    await new Promise((resolve) => setTimeout(resolve, 80));

    const renderWidth = 794;
    const renderHeight = clonedElement.offsetHeight || 1123;

    // Capture with html2canvas (never taint canvas so toDataURL never throws SecurityError)
    const canvas = await html2canvas(clonedElement, {
      scale: 1.5, // Crisp ~150 DPI vector print
      useCORS: true,
      allowTaint: false, // CRITICAL: NEVER TAINT CANVAS
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      width: renderWidth,
      height: renderHeight,
      logging: false
    });

    // Clean up sandbox immediately
    if (sandboxContainer && sandboxContainer.parentNode) {
      sandboxContainer.parentNode.removeChild(sandboxContainer);
      sandboxContainer = null;
    }

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Failed to create canvas.');
    }

    onProgress?.(70, 'পিডিএফ তৈরি করা হচ্ছে...');

    // Convert canvas to image safely
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

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
      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
    } else {
      let heightLeft = contentHeightMm;
      let position = 0;

      // Page 1
      pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, contentHeightMm, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Multi-page document support
      while (heightLeft > 5) {
        position = heightLeft - contentHeightMm;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, contentHeightMm, undefined, 'FAST');
        heightLeft -= pageHeight;
      }
    }

    onProgress?.(90, 'ডাউনলোড সম্পন্ন হচ্ছে...');

    // Exact requested safe filename: correction_form.pdf
    let safeFileName = 'correction_form.pdf';
    if (fileName) {
      const cleanBase = fileName
        .replace(/\.pdf$/i, '')
        .replace(/[^\w\d-_]/g, '_')
        .replace(/_+/g, '_')
        .trim();
      safeFileName = `${cleanBase || 'correction_form'}.pdf`;
    }

    // Direct programmatic anchor download (no blank target popup)
    const pdfBlob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = safeFileName;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();

    setTimeout(() => {
      if (downloadLink.parentNode) {
        downloadLink.parentNode.removeChild(downloadLink);
      }
      URL.revokeObjectURL(blobUrl);
    }, 10000);

    onProgress?.(100, 'সম্পন্ন হয়েছে!');
    return true;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return false;
  } finally {
    if (sandboxContainer && sandboxContainer.parentNode) {
      sandboxContainer.parentNode.removeChild(sandboxContainer);
    }
  }
}

export function triggerBrowserPrint(): void {
  if (typeof window !== 'undefined') {
    window.print();
  }
}
