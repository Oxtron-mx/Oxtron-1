import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'
import { i18n, Locale } from "@/i18n.config";
import Header from "@/components/lang/Header";
import { LayoutProvider } from "@/components/context/LayoutContext";

const fontSans = Poppins({ 
  subsets: ["latin"], 
  weight: ['100','200','300', '400', '500', '600', '700'],
  variable: '--font-sans' 
}); 

export const metadata: Metadata = {
  title: "The Path to Net Zero | Oxtron", 
  description: "Admin system for measuring, controling and capturing and reducing your GHG emissions", 
  icons: {
    icon: "/favicon.ico",
  }, 
  openGraph: {
    title: "The Path to Net Zero | Oxtron",
    description: "Admin system for measuring, controling and capturing and reducing your GHG emissions",
    images: 'https://res.cloudinary.com/dqwuwopvc/image/upload/v1721166749/portadas/oxtron_ztkcdu.png',
  }
};

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }));
}

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  return (
    <html lang={params.lang} style={{ colorScheme: 'dark' }}>
      <LayoutProvider>
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
        </head>
        <body className={cn('min-h-screen font-sans antialiased', fontSans.variable)}>
          <Header lang={params.lang}/>
          {children}
          <Toaster />
        </body>
      </LayoutProvider>
    </html>
  );
}