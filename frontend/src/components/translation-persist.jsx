'use client'

import { useEffect } from 'react'

export default function TranslationPersist() {
  useEffect(() => {
    const restoreTranslation = () => {
      const savedLang = localStorage.getItem('selected_language')
      if (!savedLang || savedLang === 'en') return

      const checkForGoogle = setInterval(() => {
        if (window.google && window.google.translate) {
          clearInterval(checkForGoogle)

          const select = document.querySelector('.goog-te-combo')
          if (select) {
            select.value = savedLang
            select.dispatchEvent(new Event('change'))
          }
        }
      }, 100)

      setTimeout(() => clearInterval(checkForGoogle), 5000)
    }

    restoreTranslation()

    const handleRouteChange = () => {
      setTimeout(restoreTranslation, 100)
    }

    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  return null
}
