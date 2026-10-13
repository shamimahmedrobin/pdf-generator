import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'সহজ পিডিএফ মেকার ও ড্যাশবোর্ড (PDF Maker & Dashboard)',
  description: 'অনলাইনে সহজে যেকোনো পিডিএফ আপলোড করে ডেমো টেমপ্লেট হিসেবে সংরক্ষণ, তথ্য পূরণ করে নতুন PDF জেনারেট, ডাউনলোড এবং পূর্ণাঙ্গ ড্যাশবোর্ড সুবিধা।',
  openGraph: {
    title: 'সহজ পিডিএফ মেকার ও ড্যাশবোর্ড (PDF Maker & Dashboard)',
    description: 'অনলাইনে সহজে যেকোনো পিডিএফ আপলোড করে ডেমো টেমপ্লেট হিসেবে সংরক্ষণ, তথ্য পূরণ করে নতুন PDF জেনারেট, ডাউনলোড এবং পূর্ণাঙ্গ ড্যাশবোর্ড সুবিধা।',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'সহজ পিডিএফ মেকার ও ড্যাশবোর্ড (PDF Maker & Dashboard)',
    description: 'অনলাইনে সহজে যেকোনো পিডিএফ আপলোড করে ডেমো টেমপ্লেট হিসেবে সংরক্ষণ, তথ্য পূরণ করে নতুন PDF জেনারেট, ডাউনলোড এবং পূর্ণাঙ্গ ড্যাশবোর্ড সুবিধা।',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="bn">
      <body className="antialiased bg-[#0B0F17] text-slate-100 font-sans min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
