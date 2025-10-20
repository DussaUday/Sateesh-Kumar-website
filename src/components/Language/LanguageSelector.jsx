// components/Language/LanguageSelector.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check, Loader2, Sparkles, Languages } from 'lucide-react';
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

  // Mobile responsive design
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Language Selector Button - Updated Colors & Mobile Optimized */}
      <motion.button
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isTranslating}
        className={`flex items-center space-x-2 px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-amber-500/15 to-yellow-600/10 backdrop-blur-2xl rounded-xl md:rounded-2xl border border-amber-300/30 text-amber-700 dark:text-amber-300 hover:border-amber-400/50 transition-all duration-300 shadow-lg hover:shadow-xl group relative overflow-hidden ${
          isTranslating ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {/* Animated Background for Translating State */}
        {isTranslating && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20"
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

        <div className="relative z-10 flex items-center space-x-2 md:space-x-3">
          {/* Icon with Animation */}
          {isTranslating ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="flex-shrink-0"
            >
              <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-amber-600 dark:text-amber-400" />
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="flex-shrink-0"
            >
              <Languages className="w-4 h-4 md:w-5 md:h-5 text-amber-600 dark:text-amber-400" />
            </motion.div>
          )}
          
          {/* Text - Hidden on very small screens */}
          <span className="font-semibold text-xs md:text-sm bg-gradient-to-r from-amber-600 to-yellow-700 dark:from-amber-400 dark:to-yellow-500 bg-clip-text text-transparent hidden xs:block">
            {isTranslating ? 'Translating...' : getLanguageName(currentLanguage)}
          </span>
          
          {/* Chevron - Only show when not translating */}
          {!isTranslating && (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0"
            >
              <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-amber-600 dark:text-amber-400" />
            </motion.div>
          )}
        </div>

        {/* Mobile Badge for Active Language */}
        {isMobile && !isTranslating && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full border border-white"
          />
        )}
      </motion.button>

      {/* Dropdown Menu - Mobile Optimized */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
            className={`absolute top-full ${
              isMobile ? 'left-0 right-0 mx-2' : 'right-0'
            } mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-amber-200/30 dark:border-amber-700/30 overflow-hidden z-50`}
          >
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-600" />
            
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 border-b border-amber-100/30 dark:border-amber-800/30"
            >
              <div className="flex items-center space-x-3">
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="p-2 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl shadow-lg"
                >
                  <Globe className="w-4 h-4 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white font-serif">
                    Select Language
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose your preferred language
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Languages List */}
            <div className="max-h-60 overflow-y-auto">
              {languages.map((language, index) => (
                <motion.button
                  key={language.code}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleLanguageSelect(language.code)}
                  disabled={isTranslating}
                  className={`w-full flex items-center space-x-3 p-3 border-b border-amber-100/20 dark:border-amber-800/20 last:border-b-0 transition-all duration-200 group relative overflow-hidden ${
                    currentLanguage === language.code
                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-amber-500/5'
                  } ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {/* Selection Indicator */}
                  {currentLanguage === language.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-yellow-600"
                    />
                  )}

                  {/* Flag with Animation */}
                  <motion.span 
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="text-2xl flex-shrink-0"
                  >
                    {language.flag}
                  </motion.span>
                  
                  {/* Language Info */}
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm font-serif">
                      {language.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {language.nativeName}
                    </div>
                  </div>
                  
                  {/* Checkmark for Selected Language */}
                  {currentLanguage === language.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                      className="flex-shrink-0 p-1 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full"
                    >
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}

                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-yellow-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    whileHover={{ opacity: 1 }}
                  />
                </motion.button>
              ))}
            </div>

            {/* Footer Actions */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-3 bg-amber-50/30 dark:bg-amber-900/20 border-t border-amber-100/30 dark:border-amber-800/30"
            >
              
            </motion.div>

            {/* Mobile Close Hint */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="p-2 text-center border-t border-amber-100/30 dark:border-amber-800/30"
              >
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Tap outside to close
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Full-screen Overlay */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSelector;