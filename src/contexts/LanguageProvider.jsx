// contexts/LanguageProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    initializeGoogleTranslate();
    checkCurrentLanguage();
  }, []);

  const checkCurrentLanguage = () => {
    // Check if there's a Google Translate cookie
    const cookies = document.cookie.split(';');
    const googtransCookie = cookies.find(cookie => cookie.trim().startsWith('googtrans='));
    
    if (googtransCookie) {
      const value = googtransCookie.split('=')[1];
      // Extract language code from cookie (format: /en/te, /en/hi, etc.)
      const match = value.match(/\/en\/([a-z-]+)/);
      if (match && match[1]) {
        setCurrentLanguage(match[1]);
        console.log(`🌐 Detected language from cookie: ${match[1]}`);
      }
    }

    // Check localStorage
    const savedLanguage = localStorage.getItem('selected-language');
    if (savedLanguage && savedLanguage !== currentLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  };

  const initializeGoogleTranslate = () => {
    // Create translate element
    const translateElement = document.createElement('div');
    translateElement.id = 'google_translate_element';
    translateElement.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 100px;
      height: 40px;
      overflow: hidden;
      z-index: 10000;
    `;
    document.body.appendChild(translateElement);

    // Define callback
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        try {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,te,hi,es,fr,de,ja,ko,zh-CN,ar,ru,pt,it',
            layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
            autoDisplay: false
          }, 'google_translate_element');

          console.log('✅ Google Translate initialized');

          // Hide UI after initialization
          setTimeout(hideGoogleTranslateUI, 1500);

        } catch (error) {
          console.error('❌ Google Translate init error:', error);
        }
      }
    };

    // Load script
    loadGoogleTranslateScript();
    addGoogleTranslateStyles();
  };

  const loadGoogleTranslateScript = () => {
    const existingScript = document.querySelector('script[src*="translate.google.com"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = `https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit&_=${Date.now()}`;
    script.async = true;
    document.head.appendChild(script);
  };

  const addGoogleTranslateStyles = () => {
    const styleId = 'google-translate-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Hide Google Translate UI */
      .goog-te-banner-frame {
        display: none !important;
        visibility: hidden !important;
      }
      .goog-te-gadget-simple {
        display: none !important;
      }
      .goog-te-gadget {
        font-size: 0 !important;
      }
      .goog-logo-link {
        display: none !important;
      }
      .goog-te-ftab-link {
        display: none !important;
      }
      .goog-te-combo {
        position: fixed !important;
        top: 10px !important;
        right: 10px !important;
        z-index: 10000 !important;
        opacity: 0.01 !important;
        pointer-events: auto !important;
      }
      .goog-te-menu-frame {
        z-index: 100001 !important;
      }
      body {
        top: 0 !important;
      }
    `;
    document.head.appendChild(style);
  };

  const hideGoogleTranslateUI = () => {
    // Multiple methods to hide the banner
    const elementsToHide = [
      '.goog-te-banner-frame',
      '.skiptranslate',
      '.goog-te-gadget',
      '.goog-te-gadget-simple',
      '.goog-logo-link',
      '.goog-te-ftab-link'
    ];

    elementsToHide.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.style.display = 'none';
        element.style.visibility = 'hidden';
        element.style.height = '0';
        element.style.width = '0';
        element.style.overflow = 'hidden';
        element.style.position = 'absolute';
        element.style.top = '-9999px';
        element.style.left = '-9999px';
      });
    });

    // Remove from DOM after a delay
    setTimeout(() => {
      const banner = document.querySelector('.goog-te-banner-frame');
      if (banner && banner.parentNode) {
        banner.parentNode.removeChild(banner);
      }
      
      const skipTranslate = document.querySelector('.skiptranslate');
      if (skipTranslate && skipTranslate.parentNode) {
        skipTranslate.parentNode.removeChild(skipTranslate);
      }
    }, 2000);

    // Remove Google branding
    const gadgets = document.querySelectorAll('.goog-te-gadget');
    gadgets.forEach(gadget => {
      gadget.innerHTML = gadget.innerHTML.replace(/Powered by.*?Google/, '');
    });
  };

  const cleanupGoogleTranslate = () => {
    const elementsToRemove = [
      '.goog-te-banner-frame',
      '.goog-te-menu-frame',
      '#google_translate_element'
    ];

    elementsToRemove.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => element.remove());
    });

    document.body.style.top = '0px';
  };

  const changeLanguage = (langCode) => {
    if (isTranslating) return;

    console.log(`🔄 Changing language to: ${langCode}`);
    setIsTranslating(true);

    // SPECIAL HANDLING FOR ENGLISH - Clear translation to return to original
    if (langCode === 'en') {
      returnToEnglish();
      return;
    }

    // For other languages, set the Google Translate cookie
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${window.location.hostname}; max-age=${60*60*24*30}`;
    
    // Also set without domain for localhost
    document.cookie = `googtrans=/en/${langCode}; path=/; max-age=${60*60*24*30}`;

    // Update application state
    setCurrentLanguage(langCode);
    localStorage.setItem('selected-language', langCode);
    document.documentElement.lang = langCode;

    // Show visual feedback
    showTranslationFeedback(langCode);

    // Reload the page after a short delay to apply the translation
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const returnToEnglish = () => {
    console.log('🔄 Returning to English (clearing translation)');
    
    // Clear the Google Translate cookie to return to original language
    document.cookie = 'googtrans=; path=/; domain=.' + window.location.hostname + '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // Also try to clear any other Google Translate related cookies
    document.cookie = 'googtrans=; path=/; domain=.' + window.location.hostname + '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    // Update application state
    setCurrentLanguage('en');
    localStorage.setItem('selected-language', 'en');
    document.documentElement.lang = 'en';

    // Show visual feedback
    showTranslationFeedback('en');

    // Force reload to clear any cached translation
    setTimeout(() => {
      // Add cache busting to ensure fresh load
      window.location.href = window.location.origin + window.location.pathname + '?lang=en&t=' + Date.now();
    }, 1500);
  };

  const showTranslationFeedback = (langCode) => {
    // Remove existing feedback
    const existingFeedback = document.querySelector('.translation-feedback');
    if (existingFeedback) {
      existingFeedback.remove();
    }

    const feedback = document.createElement('div');
    feedback.className = 'translation-feedback';
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #10B981, #059669);
      color: white;
      padding: 12px 20px;
      border-radius: 10px;
      z-index: 10000;
      font-weight: 600;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.2);
    `;

    const languageNames = {
      en: 'English', te: 'Telugu', hi: 'Hindi'
    };

    const message = langCode === 'en' 
      ? 'Returning to English...' 
      : `Translating to ${languageNames[langCode] || langCode}...`;

    feedback.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 16px; height: 16px; border: 2px solid white; border-radius: 50%; border-top: 2px solid transparent; animation: spin 1s linear infinite;"></div>
        ${message}
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;

    document.body.appendChild(feedback);

    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.remove();
      }
    }, 3000);
  };

  const toggleTranslator = () => {
    setIsTranslatorOpen(!isTranslatorOpen);
  };

  const resetToEnglish = () => {
    // Use the special English handler
    returnToEnglish();
    setIsTranslatorOpen(false);
  };

  const getLanguageName = (code) => {
    const languages = {
      en: 'English', te: 'Telugu', hi: 'Hindi'
    };
    return languages[code] || code.toUpperCase();
  };

  const value = {
    currentLanguage,
    isTranslatorOpen,
    toggleTranslator,
    changeLanguage,
    resetToEnglish,
    getLanguageName,
    isTranslating
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
      
      {/* Custom Translator Modal */}
      {isTranslatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl border border-white/20">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Select Language
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose your preferred language
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6 max-h-60 overflow-y-auto">
              {[
                { code: 'en', name: 'English', flag: '🇺🇸' },
                { code: 'te', name: 'Telugu', flag: '🇮🇳' },
                { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
                
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setIsTranslatorOpen(false);
                  }}
                  disabled={isTranslating}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                    currentLanguage === lang.code
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-300'
                  } ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="text-2xl mb-2">{lang.flag}</span>
                  <span className="font-semibold text-sm">{lang.name}</span>
                </button>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={resetToEnglish}
                disabled={isTranslating}
                className="flex-1 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                English
              </button>
              <button
                onClick={() => setIsTranslatorOpen(false)}
                className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Powered by Google Translate
            </p>
          </div>
        </div>
      )}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;