import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { User, Sun, Moon, Menu, X, Sparkles, Award, HeartHandshake } from 'lucide-react';
import LanguageSelector from '../Language/LanguageSelector';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Update active section based on scroll position
      const sections = ['home', 'about', 'services', 'awards', 'gallery'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home', icon: User },
    { name: 'About', href: '#about', icon: HeartHandshake },
    { name: 'Services', href: '#services', icon: Award },
    { name: 'Awards', href: '#awards', icon: Sparkles },
    { name: 'Gallery', href: '#gallery', icon: Menu }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-amber-300/50 dark:border-amber-600/30 py-2 shadow-2xl' 
        : 'bg-transparent py-4'
    }`}>
      {/* Animated Background Gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 0.3 : 0 }}
        className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-rose-500/20 to-maroon-700/20"
        transition={{ duration: 0.5 }}
      />
      
      <nav className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between">
          {/* Logo - Enhanced with Gold/Maroon Theme */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-3"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="relative p-2 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl shadow-lg"
            >
              <User className="w-6 h-6 text-white" />
              {/* Pulsing Effect */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 border-2 border-amber-400 rounded-2xl"
              />
            </motion.div>
            
            <div className="flex flex-col">
              <motion.h1 
                className="text-2xl font-black font-serif bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                Puttagunta
              </motion.h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium -mt-1">
                Venkata Sateesh Kumar
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation - Enhanced with Active States */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-6 py-3 font-medium transition-all duration-300 rounded-2xl mx-1 ${
                  activeSection === item.href.substring(1)
                    ? 'text-white bg-gradient-to-r from-amber-500 to-yellow-600 shadow-lg shadow-amber-500/25'
                    : 'text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                
                {/* Active Indicator */}
                {activeSection === item.href.substring(1) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-2xl border-2 border-amber-300/50"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.a>
            ))}
          </div>

          {/* Controls - Enhanced with Theme */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <LanguageSelector />
            </motion.div>

            {/* Theme Toggle - Enhanced */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="relative p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-rose-500/10 dark:from-amber-500/20 dark:to-rose-500/20 border border-amber-300/50 dark:border-amber-600/30 backdrop-blur-sm transition-all duration-300 group"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400 group-hover:text-amber-300" />
              ) : (
                <Moon className="w-5 h-5 text-amber-600 group-hover:text-amber-500" />
              )}
              
              {/* Glow Effect */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-amber-400/20 rounded-2xl"
              />
            </motion.button>
            
            {/* Mobile Menu Button - Enhanced */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="lg:hidden p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-rose-500/10 dark:from-amber-500/20 dark:to-rose-500/20 border border-amber-300/50 dark:border-amber-600/30 backdrop-blur-sm transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              ) : (
                <Menu className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.9 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="lg:hidden mt-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-amber-200/50 dark:border-amber-700/30 overflow-hidden"
            >
              <div className="flex flex-col p-2">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                    className={`flex items-center space-x-3 py-4 px-6 text-lg font-medium transition-all duration-300 border-b border-amber-100/50 dark:border-amber-800/30 last:border-b-0 ${
                      activeSection === item.href.substring(1)
                        ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-xl'
                        : 'text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                    
                    {/* Active Indicator for Mobile */}
                    {activeSection === item.href.substring(1) && (
                      <motion.div
                        layoutId="activeMobileNav"
                        className="ml-auto w-2 h-2 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.a>
                ))}
              </div>
              
              {/* Mobile Menu Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-amber-500/5 to-rose-500/5 border-t border-amber-200/30 dark:border-amber-700/30 p-4"
              >
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  National Trustee, VHP
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-600"
        style={{ width: `${(navItems.findIndex(item => item.href.substring(1) === activeSection) + 1) / navItems.length * 100}%` }}
        transition={{ duration: 0.3 }}
      />
    </header>
  );
};

export default Header;