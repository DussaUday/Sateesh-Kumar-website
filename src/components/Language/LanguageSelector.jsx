// components/Language/LanguageSelector.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check, Loader2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageProvider';

const LanguageSelector = () => {
  const { 
    currentLanguage, 
    isTranslatorOpen, 
    toggleTranslator,
    changeLanguage,
    resetToEnglish,
    getLanguageName,
    isTranslating
  } = useLanguage();
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Language Selector Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isTranslating}
        className={`flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-2xl rounded-2xl border border-white/20 text-white hover:border-white/40 transition-all duration-300 shadow-2xl hover:shadow-3xl group relative overflow-hidden ${
          isTranslating ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isTranslating && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: '200% 200%',
            }}
          />
        )}

        <div className="relative z-10 flex items-center space-x-3">
          {isTranslating ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-5 h-5 text-blue-300" />
            </motion.div>
          ) : (
            <Globe className="w-5 h-5 text-blue-300" />
          )}
          
          <span className="font-semibold text-sm bg-gradient-to-r from-black to-blue-400 bg-clip-text text-transparent">
            {isTranslating ? 'Translating...' : getLanguageName(currentLanguage)}
          </span>
          
          {!isTranslating && (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4 text-blue-300" />
            </motion.div>
          )}
        </div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-3 w-72 bg-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <Globe className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Language</h3>
                  <p className="text-sm text-gray-400">Select your language</p>
                </div>
              </div>
            </div>

            {/* Languages List */}
            <div className="max-h-80 overflow-y-auto">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  disabled={isTranslating}
                  className={`w-full flex items-center space-x-3 p-3 border-b border-white/5 last:border-b-0 transition-all duration-200 group ${
                    currentLanguage === language.code
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'text-white hover:bg-white/5'
                  } ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="text-2xl flex-shrink-0">{language.flag}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{language.name}</div>
                    <div className="text-xs text-gray-400">{language.nativeName}</div>
                  </div>
                  {currentLanguage === language.code && (
                    <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Footer Actions */}
            

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;