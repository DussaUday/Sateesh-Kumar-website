import React, { createContext, useContext, useState, useEffect } from 'react'
import i18n from '../i18n'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false)
  const [googleTranslateLoaded, setGoogleTranslateLoaded] = useState(false)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('portfolio-language') || 'en'
    setCurrentLanguage(savedLanguage)
    i18n.changeLanguage(savedLanguage)
    document.documentElement.lang = savedLanguage

    // Load Google Translate
    loadGoogleTranslate()
  }, [])

  const loadGoogleTranslate = () => {
    if (!window.google || !window.google.translate) {
      const script = document.createElement('script')
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.head.appendChild(script)

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,te,hi',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element')
        setGoogleTranslateLoaded(true)
      }
    }
  }

  const changeLanguage = async (lang) => {
    try {
      setCurrentLanguage(lang)
      await i18n.changeLanguage(lang)
      localStorage.setItem('portfolio-language', lang)
      document.documentElement.lang = lang
      setIsLanguageModalOpen(false)
      
      // Trigger custom event for dynamic content updates
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }))
    } catch (error) {
      console.error('Language change error:', error)
    }
  }

  const openLanguageModal = () => setIsLanguageModalOpen(true)
  const closeLanguageModal = () => setIsLanguageModalOpen(false)

  const translatePage = (language) => {
    if (window.google && window.google.translate) {
      const translateInstance = window.google.translate.TranslateElement.getInstance()
      if (translateInstance) {
        translateInstance.showBanner(false)
      }
    }
  }

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      changeLanguage,
      isLanguageModalOpen,
      openLanguageModal,
      closeLanguageModal,
      googleTranslateLoaded,
      translatePage
    }}>
      {children}
      
      {/* Google Translate Element */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      
      {/* Language Selection Modal */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-scaleIn">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              Select Language
            </h3>
            
            {/* Manual Language Selection */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {[
                { code: 'en', name: 'English', flag: '🇺🇸' },
                { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
                { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                    currentLanguage === lang.code
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:scale-102'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-lg font-semibold text-gray-800 dark:text-white">
                    {lang.name}
                  </span>
                  {currentLanguage === lang.code && (
                    <div className="ml-auto w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                  )}
                </button>
              ))}
            </div>

            {/* Google Translate Notice */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                For more language options, use Google Translate above
              </p>
            </div>

            <button
              onClick={closeLanguageModal}
              className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </LanguageContext.Provider>
  )
}