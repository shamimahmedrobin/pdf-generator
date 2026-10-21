import type {Metadata} from 'next';
import {Hind_Siliguri, JetBrains_Mono, Plus_Jakarta_Sans} from 'next/font/google';
import './globals.css'; // Global styles
import {BASE_PATH} from '@/lib/base-path';

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-hind',
  display: 'swap',
});

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

const title = 'সহজ পিডিএফ মেকার ও ড্যাশবোর্ড (PDF Maker & Dashboard)';
const description =
  'অনলাইনে সহজে যেকোনো পিডিএফ আপলোড করে ডেমো টেমপ্লেট হিসেবে সংরক্ষণ, তথ্য পূরণ করে নতুন PDF জেনারেট, ডাউনলোড এবং পূর্ণাঙ্গ ড্যাশবোর্ড সুবিধা।';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title,
  description,
  applicationName: 'PDF Generator',
  robots: {index: true, follow: true},
  openGraph: {
    title,
    description,
    type: 'website',
    locale: 'bn_BD',
    url: appUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="bn">
      <head>
        <link rel="stylesheet" href={`${BASE_PATH}/fonts/fonts.css`} />
      </head>
      <body
        className={`${hindSiliguri.variable} ${jakartaSans.variable} ${jetBrainsMono.variable} antialiased bg-[#0B0F17] text-slate-100 font-sans min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
