import React, { useState } from 'react';
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
import LoadingScreen from './components/Layout/LoadingScreen';
import RecentGallery from './components/Gallery/RecentGallery';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          {/* Main App Container - High Contrast Black/White/Gold */}
          <div className="min-h-screen bg-white text-gray-900 dark:bg-deep-gray-950 dark:text-white transition-colors duration-500">
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