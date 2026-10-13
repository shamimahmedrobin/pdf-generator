'use client';

interface GeneratePdfOptions {
  fileName?: string;
  elementId?: string;
  onProgress?: (progress: number, stage: string) => void;
}

export async function generateAndDownloadPdf({
  fileName = 'document.pdf',
  elementId = 'pdf-render-area',
  onProgress
}: GeneratePdfOptions = {}): Promise<boolean> {
  let tempContainer: HTMLDivElement | null = null;
  try {
    if (typeof window === 'undefined') return false;

    const sourceElement = document.getElementById(elementId);
    if (!sourceElement) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    onProgress?.(15, 'ডকুমেন্ট প্রস্তুত করা হচ্ছে...');

    // Wait for all custom fonts to be ready
    if (document.fonts) {
      await document.fonts.ready;
    }

    // Dynamically import client-only libraries
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    onProgress?.(35, 'লেআউট ক্লোন ও অপ্টিমাইজ করা হচ্ছে...');

    // Clone element to an isolated, unscaled sandbox to ensure 1:1 pixel match with preview
    tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-99999px';
    tempContainer.style.top = '0px';
    tempContainer.style.width = '794px';
    tempContainer.style.minHeight = '1123px';
    tempContainer.style.backgroundColor = '#ffffff';
    tempContainer.style.zIndex = '-99999';
    tempContainer.style.transform = 'none';
    tempContainer.style.margin = '0';
    tempContainer.style.padding = '0';
    tempContainer.style.boxSizing = 'border-box';

    const clonedElement = sourceElement.cloneNode(true) as HTMLElement;
    clonedElement.style.transform = 'none';
    clonedElement.style.boxShadow = 'none';
    clonedElement.style.margin = '0 auto';
    clonedElement.style.width = '794px';

    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);

    onProgress?.(55, 'উচ্চ রেজোলিউশন ইমেজ রেন্ডার হচ্ছে...');

    const canvas = await html2canvas(clonedElement, {
      scale: 2.5, // 240 DPI for razor-sharp typography and borders
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 794,
      height: clonedElement.scrollHeight,
      windowWidth: 794,
      windowHeight: clonedElement.scrollHeight
    });

    onProgress?.(80, 'পিডিএফ ফাইল তৈরি করা হচ্ছে...');

    const imgData = canvas.toDataURL('image/png', 1.0);
    
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
      // Exactly 1 page: fit full A4 without extra pages
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
    } else {
      // Multi-page document support
      let heightLeft = contentHeightMm;
      let position = 0;

      // Page 1
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, contentHeightMm, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Add subsequent pages only if there is meaningful remaining content (> 5mm)
      while (heightLeft > 5) {
        position = heightLeft - contentHeightMm;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, contentHeightMm, undefined, 'FAST');
        heightLeft -= pageHeight;
      }
    }

    onProgress?.(95, 'ডাউনলোড শুরু হচ্ছে...');
    
    const safeFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    pdf.save(safeFileName);

    onProgress?.(100, 'সম্পন্ন হয়েছে!');
    return true;
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
