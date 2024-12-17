import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import NextTopLoader from 'nextjs-toploader'

import './global.css'
import TranslationPersist from '@/components/translation-persist'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CarBoard',
  description: 'Intelligent system for vehicle fleet management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="google_translate_element" className="goog-te-gadget google-translate-hidden" />
        <TranslationPersist />
        <NextTopLoader showSpinner={false} />
        {children}
        <Toaster richColors />
        <footer>
          <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" async />
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
            `
            }}
          />
        </footer>
      </body>
    </html>
  )
}
