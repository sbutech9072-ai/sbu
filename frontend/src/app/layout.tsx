import type { Metadata, Viewport } from 'next';
import { Anton, Inter } from 'next/font/google';
import { siteConfig } from '@/config/site';
import { ThemeProvider } from '@/context/theme-context';
import ChatWidget from '@/components/ai/chat-widget';
import './globals.css';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'Software Engineering',
    'Next.js Development',
    'Cloud Architecture',
    'DevOps',
    'AI Solutions',
    'React Native',
    'Digital Product Studio',
    'Sbu Tech',
  ],
  authors: [{ name: 'Sbu Tech Engineering Team' }],
  creator: 'Sbu Tech',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    creator: '@sbutech',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#EEE6E2',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${anton.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#EEE6E2] text-[#1E5A54] font-sans antialiased selection:bg-[#F7623D] selection:text-[#EEE6E2]">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('sbu-theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        <ThemeProvider>
          {children}
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
