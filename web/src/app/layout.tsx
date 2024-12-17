import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import { JSX, ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CarBoard',
  description: 'Intelligent system for vehicle fleet management',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div
          id="google_translate_element"
          className="goog-te-gadget google-translate-hidden"
        />
        <NextTopLoader showSpinner={false} />
        {children}
        <Toaster richColors />
        <footer>
          <script
            type="text/javascript"
            src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
            async
          />
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
                function googleTranslateElementInit() {
                  new google.translate.TranslateElement({
                    pageLanguage: 'en',
                    autoDisplay: false,
                    includedLanguages: 'en,fi',
                    layout: google.translate.TranslateElement.FloatPosition.TOP_LEFT
                  }, 'google_translate_element');
                }
              `,
            }}
          />
        </footer>
      </body>
    </html>
  );
}
