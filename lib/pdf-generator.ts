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
  fileName = 'document.pdf',
  elementId = 'pdf-render-area',
  onProgress
}: GeneratePdfOptions = {}): Promise<boolean> {
  let tempContainer: HTMLDivElement | null = null;
  try {
    if (typeof window === 'undefined') return false;

    // Locate source element
    const sourceElement = document.getElementById(elementId);
    if (!sourceElement) {
      throw new Error(`Element with id "${elementId}" not found in document.`);
    }

    onProgress?.(15, 'ডকুমেন্ট প্রস্তুত করা হচ্ছে...');

    // Wait for fonts to settle (with a quick 800ms safety timeout)
    if (typeof document !== 'undefined' && document.fonts) {
      try {
        await Promise.race([
          document.fonts.ready,
          new Promise((resolve) => setTimeout(resolve, 800))
        ]);
      } catch {
        // Continue even if font ready promise times out
      }
    }

    // Dynamically import libraries
    const html2canvasModule = await import('html2canvas');
    const html2canvas = html2canvasModule.default || html2canvasModule;
    const { jsPDF } = await import('jspdf');

    onProgress?.(35, 'লেআউট ক্লোন ও অপ্টিমাইজ করা হচ্ছে...');

    // Isolated sandbox: position at top:0 left:0 behind main UI with z-index: -9999
    // This gives accurate client rects (0,0) without rendering offscreen clipped canvases!
    tempContainer = document.createElement('div');
    tempContainer.id = 'pdf-render-sandbox';
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '0px';
    tempContainer.style.top = '0px';
    tempContainer.style.width = '794px';
    tempContainer.style.minHeight = '1123px';
    tempContainer.style.backgroundColor = '#ffffff';
    tempContainer.style.zIndex = '-9999';
    tempContainer.style.pointerEvents = 'none';
    tempContainer.style.overflow = 'hidden';
    tempContainer.style.margin = '0';
    tempContainer.style.padding = '0';
    tempContainer.style.boxSizing = 'border-box';
    tempContainer.style.opacity = '1';
    tempContainer.style.visibility = 'visible';

    const clonedElement = sourceElement.cloneNode(true) as HTMLElement;
    clonedElement.style.transform = 'none';
    clonedElement.style.boxShadow = 'none';
    clonedElement.style.margin = '0';
    clonedElement.style.width = '794px';
    clonedElement.style.minHeight = '1123px';
    clonedElement.style.display = 'flex';
    clonedElement.style.visibility = 'visible';
    clonedElement.style.opacity = '1';

    // Ensure all cloned img elements have crossOrigin set and wait for completion
    const images = Array.from(clonedElement.querySelectorAll('img'));
    for (const img of images) {
      img.crossOrigin = 'anonymous';
    }

    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);

    // Give browser a microtask tick to layout cloned element
    await new Promise((resolve) => setTimeout(resolve, 80));

    // Wait for any images inside clone to be ready
    if (images.length > 0) {
      await Promise.all(
        images.map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete && img.naturalWidth > 0) {
                resolve(true);
              } else {
                img.onload = () => resolve(true);
                img.onerror = () => resolve(true);
                setTimeout(() => resolve(true), 1200);
              }
            })
        )
      );
    }

    onProgress?.(55, 'উচ্চ রেজোলিউশন ইমেজ রেন্ডার হচ্ছে...');

    const renderHeight = clonedElement.offsetHeight || clonedElement.scrollHeight || 1123;

    // html2canvas capture: scale 2x = crisp ~200 DPI without mobile GPU texture overflow
    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      allowTaint: false, // CRITICAL: false prevents "Tainted canvases may not be exported" DOMException
      logging: false,
      backgroundColor: '#ffffff',
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      width: 794,
      height: renderHeight,
      windowWidth: 794,
      windowHeight: renderHeight
    });

    onProgress?.(80, 'পিডিএফ ফাইল তৈরি করা হচ্ছে...');

    let imgData: string;
    try {
      imgData = canvas.toDataURL('image/png', 1.0);
    } catch (e1) {
      console.warn('PNG toDataURL failed, attempting JPEG fallback:', e1);
      imgData = canvas.toDataURL('image/jpeg', 0.95);
    }

    // A4 dimensions in mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const contentHeightMm = (canvas.height * pageWidth) / canvas.width;

    // Check if single page (Form-2, NID, and Certificate fit on 1 A4 page)
    if (contentHeightMm <= 300) {
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
    } else {
      let heightLeft = contentHeightMm;
      let position = 0;

      // Page 1
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, contentHeightMm, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Multi-page document support
      while (heightLeft > 5) {
        position = heightLeft - contentHeightMm;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, contentHeightMm, undefined, 'FAST');
        heightLeft -= pageHeight;
      }
    }

    onProgress?.(95, 'ডাউনলোড শুরু হচ্ছে...');

    // Clean ASCII filename for mobile Android / cross-browser safety
    const cleanBase = (fileName || 'document')
      .replace(/\.pdf$/i, '')
      .replace(/[^\w\d-_]/g, '_')
      .replace(/_+/g, '_')
      .trim();
    const safeFileName = `${cleanBase || 'document'}.pdf`;

    // Generate PDF Blob
    const pdfBlob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);

    // Method 1: Programmatic anchor download (most reliable across Android Chrome and desktop)
    let downloaded = false;
    try {
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = safeFileName;
      downloadLink.rel = 'noopener noreferrer';
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloaded = true;
      setTimeout(() => {
        if (downloadLink.parentNode) {
          downloadLink.parentNode.removeChild(downloadLink);
        }
      }, 3000);
    } catch (linkErr) {
      console.warn('Anchor link click download error:', linkErr);
    }

    // Method 2: jsPDF native save fallback
    try {
      pdf.save(safeFileName);
      downloaded = true;
    } catch (pdfSaveErr) {
      console.warn('pdf.save error:', pdfSaveErr);
    }

    // Keep blob URL active for 20 seconds so mobile downloads can complete
    setTimeout(() => {
      try {
        URL.revokeObjectURL(blobUrl);
      } catch {}
    }, 20000);

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
