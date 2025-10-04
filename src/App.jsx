// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageProvider';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Services from './components/Services/Services';
import Awards from './components/Awards/Awards';
import Gallery from './components/Gallery/Gallery';
import AdminDashboard from './components/Admin/AdminDashboard';
import LoadingScreen from './components/Layout/LoadingScreen';
import RecentGallery from './components/Gallery/RecentGallery';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading completion
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(loadingTimer);
    };
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
            {isLoading ? (
              <LoadingScreen onLoadingComplete={handleLoadingComplete} />
            ) : (
              <>
                <Header />
                <main className="translated-content">
                  <Routes>
                    <Route path="/" element={
                      <>
                        <Hero />
                        <RecentGallery />
                        <About />
                        <Services />
                        <Awards />
                        <Gallery />
                      </>
                    } />
                    <Route path="/admin" element={<AdminDashboard />} />
                  </Routes>
                </main>
                <Footer />
              </>
            )}
          </div>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;