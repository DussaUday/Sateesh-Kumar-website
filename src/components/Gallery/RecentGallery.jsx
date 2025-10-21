import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Play, Pause, Image as ImageIcon, Award, Settings, Users, Star, Sparkles, Clock, Heart, Target } from 'lucide-react';
import axios from 'axios';

const RecentGallery = () => {
  const { t } = useTranslation();
  const [allImages, setAllImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchAllImages();
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying && allImages.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % allImages.length);
        setImageLoaded(false);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, allImages.length]);

  // Parallax effect for background
  const parallaxX = mousePosition.x * 0.01;
  const parallaxY = mousePosition.y * 0.01;

  const handleImageLoad = (event) => {
    const img = event.target;
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    const aspectRatio = width / height;
    
    setImageDimensions({ width, height, aspectRatio });
    setImageLoaded(true);
  };

  const getImageContainerClass = (aspectRatio) => {
    // Fixed container size for all images
    return 'w-full h-[400px] md:h-[500px] lg:h-[600px]';
  };

  const getImageStyle = (aspectRatio) => {
    // For landscape images (wider than tall)
    if (aspectRatio > 1) {
      return {
        width: '100%',
        height: 'auto',
        maxHeight: '100%',
        objectFit: 'contain'
      };
    }
    // For portrait images (taller than wide)
    else {
      return {
        width: 'auto',
        height: '100%',
        maxWidth: '100%',
        objectFit: 'contain'
      };
    }
  };

  const getContentPadding = (aspectRatio) => {
    if (aspectRatio < 0.7) {
      return 'p-6 md:p-8';
    } else {
      return 'p-4 md:p-6';
    }
  };

  const fetchAllImages = async () => {
    try {
      setLoading(true);
      
      const [galleryRes, awardsRes, servicesRes, aboutRes] = await Promise.all([
        axios.get('https://sateesh-kumar-portfolio.onrender.com/api/gallery?limit=100').catch(() => ({ data: [] })),
        axios.get('https://sateesh-kumar-portfolio.onrender.com/api/awards').catch(() => ({ data: [] })),
        axios.get('https://sateesh-kumar-portfolio.onrender.com/api/services').catch(() => ({ data: [] })),
        axios.get('https://sateesh-kumar-portfolio.onrender.com/api/about/sections').catch(() => ({ data: [] }))
      ]);

      const allImagesData = [];
      const uniqueImageUrls = new Set();

      // Process gallery images
      if (galleryRes.data && Array.isArray(galleryRes.data)) {
        galleryRes.data.forEach(item => {
          if (item.image && !uniqueImageUrls.has(item.image)) {
            uniqueImageUrls.add(item.image);
            allImagesData.push({
              id: item._id,
              image: item.image,
              title: item.title,
              description: item.description,
              category: item.category,
              type: 'gallery',
              date: item.createdAt,
              icon: ImageIcon
            });
          }
        });
      }

      // Process award images
      if (awardsRes.data && Array.isArray(awardsRes.data)) {
        awardsRes.data.forEach(award => {
          if (award.mainImage && !uniqueImageUrls.has(award.mainImage)) {
            uniqueImageUrls.add(award.mainImage);
            allImagesData.push({
              id: award._id + '-main',
              image: award.mainImage,
              title: `${award.title} - Main Award Image`,
              description: award.description,
              category: 'awards',
              type: 'award',
              date: award.createdAt,
              icon: Award
            });
          }
          
          if (award.images && Array.isArray(award.images)) {
            award.images.forEach((img, index) => {
              if (img.url && !uniqueImageUrls.has(img.url)) {
                uniqueImageUrls.add(img.url);
                allImagesData.push({
                  id: award._id + '-img-' + index,
                  image: img.url,
                  title: img.title || `${award.title} - Award Image`,
                  description: award.description,
                  category: 'awards',
                  type: 'award',
                  date: award.createdAt,
                  icon: Award
                });
              }
            });
          }
        });
      }

      // Process service images
      if (servicesRes.data && Array.isArray(servicesRes.data)) {
        servicesRes.data.forEach(service => {
          if (service.mainImage && !uniqueImageUrls.has(service.mainImage)) {
            uniqueImageUrls.add(service.mainImage);
            allImagesData.push({
              id: service._id + '-main',
              image: service.mainImage,
              title: `${service.title} - Main Service Image`,
              description: service.description,
              category: 'services',
              type: 'service',
              date: service.createdAt,
              icon: Settings
            });
          }
          
          if (service.images && Array.isArray(service.images)) {
            service.images.forEach((img, index) => {
              if (img.url && !uniqueImageUrls.has(img.url)) {
                uniqueImageUrls.add(img.url);
                allImagesData.push({
                  id: service._id + '-img-' + index,
                  image: img.url,
                  title: img.title || `${service.title} - Service Image`,
                  description: service.description,
                  category: 'services',
                  type: 'service',
                  date: service.createdAt,
                  icon: Settings
                });
              }
            });
          }
        });
      }

      // Process about section images
      if (aboutRes.data && Array.isArray(aboutRes.data)) {
        aboutRes.data.forEach(section => {
          if (section.image && !uniqueImageUrls.has(section.image)) {
            uniqueImageUrls.add(section.image);
            allImagesData.push({
              id: section._id,
              image: section.image,
              title: section.title,
              description: section.content,
              category: 'about',
              type: 'about',
              date: section.createdAt,
              icon: Users
            });
          }
        });
      }

      const sortedImages = allImagesData
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 12);

      setAllImages(sortedImages);
      
    } catch (error) {
      console.error('Error fetching all images:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
    setImageLoaded(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    setImageLoaded(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setImageLoaded(false);
  };

  if (loading) {
    return (
      <section className="relative py-16 bg-gradient-to-br from-stone-50 via-stone-100 to-white dark:from-gray-900 dark:via-gray-950 dark:to-black overflow-hidden min-h-[60vh] flex items-center justify-center">
        {/* Background with parallax */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ 
            backgroundImage: `url('')`,
            transform: `translateX(${parallaxX}px) translateY(${parallaxY}px)`
          }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center"
        >
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-300 font-serif text-lg">Loading precious moments...</p>
        </motion.div>
      </section>
    );
  }

  if (allImages.length === 0) {
    return null;
  }

  const currentImage = allImages[currentIndex];
  const imageContainerClass = getImageContainerClass(imageDimensions.aspectRatio);
  const imageStyle = imageLoaded ? getImageStyle(imageDimensions.aspectRatio) : {};
  const contentPaddingClass = imageLoaded ? getContentPadding(imageDimensions.aspectRatio) : 'p-4 md:p-6';

  return (
    <section className="relative py-16 bg-gradient-to-br from-stone-50 via-stone-100 to-white dark:from-gray-900 dark:via-gray-950 dark:to-black overflow-hidden">
      
      {/* Background with parallax */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ 
          backgroundImage: `url('')`,
          transform: `translateX(${parallaxX}px) translateY(${parallaxY}px)`
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Particles - Gold/White Theme */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-amber-400/30 dark:bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0, 1, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Gradient Orbs - Gold/Maroon Theme */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-400/15 to-maroon-700/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-white/15 to-gray-500/15 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black font-serif text-gray-800 dark:text-white mb-4"
          >
            <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Recent Moments
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-serif italic bg-black/30 backdrop-blur-sm px-6 py-3 rounded-xl border border-amber-400/30"
          >
            "Capturing the journey of service, leadership, and community impact"
          </motion.p>
        </motion.div>
        
        {/* Main Carousel */}
        <div className="relative max-w-6xl mx-auto">
          {/* Carousel Container */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-200 dark:bg-gray-800 border-2 border-amber-300/50 dark:border-amber-700/50">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: imageLoaded ? 1 : 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="flex items-center justify-center w-full"
              >
                {/* Image Container - Fixed Size */}
                <div className={`${imageContainerClass} flex items-center justify-center bg-gray-100 dark:bg-gray-900 relative overflow-hidden`}>
                  <img
                    src={currentImage?.image}
                    alt={currentImage?.title}
                    style={imageStyle}
                    className="transition-all duration-500"
                    onLoad={handleImageLoad}
                  />
                  
                  {/* Loading State */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                      <motion.div
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center"
                      >
                        <Sparkles className="w-8 h-8 text-white" />
                      </motion.div>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Content Overlay */}
                  <div className={`absolute bottom-0 left-0 right-0 ${contentPaddingClass} text-white`}>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm border border-amber-300/30"
                      >
                        {currentImage?.icon && (
                          <currentImage.icon className="w-3 h-3 md:w-4 md:h-4 text-amber-300" />
                        )}
                        <span className="text-xs md:text-sm font-medium capitalize text-amber-100">{currentImage?.type}</span>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="px-3 py-1 bg-amber-500/80 rounded-full backdrop-blur-sm border border-amber-300/30"
                      >
                        <span className="text-xs md:text-sm font-medium capitalize text-white">{currentImage?.category}</span>
                      </motion.div>
                    </div>
                    <motion.h3 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-lg md:text-xl lg:text-2xl font-bold mb-2 line-clamp-2 font-serif"
                    >
                      {currentImage?.title}
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-white/80 text-sm md:text-base line-clamp-2 font-light"
                    >
                      {currentImage?.description}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="absolute inset-0 flex items-center justify-between p-3 md:p-4">
              <motion.button
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevSlide}
                className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 border border-amber-300/30 cursor-pointer z-10"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 border border-amber-300/30 cursor-pointer z-10"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                ) : (
                  <Play className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextSlide}
                className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 border border-amber-300/30 cursor-pointer z-10"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
              </motion.button>
            </div>

            {/* Image Counter */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-3 right-3 md:top-4 md:right-4 px-2 py-1 md:px-3 md:py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs md:text-sm z-10 border border-amber-300/30"
            >
              {currentIndex + 1} / {allImages.length}
            </motion.div>
          </div>

          {/* Thumbnail Strip */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 px-2 md:px-4"
          >
            <div className="flex space-x-2 md:space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-300 dark:scrollbar-thumb-amber-600 scrollbar-track-transparent">
              {allImages.map((item, index) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 relative rounded-lg md:rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                    index === currentIndex 
                      ? 'border-amber-500 dark:border-amber-400 scale-105 shadow-lg shadow-amber-500/25' 
                      : 'border-transparent hover:border-amber-300 dark:hover:border-amber-600'
                  }`}
                  onClick={() => goToSlide(index)}
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {index === currentIndex && (
                    <motion.div 
                      layoutId="activeThumbnail"
                      className="absolute inset-0 bg-amber-500/20"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  <div className="absolute top-1 left-1 p-0.5 md:p-1 bg-black/50 rounded-full">
                    <item.icon className="w-2 h-2 md:w-3 md:h-3 text-amber-300" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Dots Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center space-x-1.5 md:space-x-2 mt-4"
          >
            {allImages.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => goToSlide(index)}
                className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentIndex 
                    ? 'bg-amber-500 dark:bg-amber-400 scale-125 shadow shadow-amber-500/50' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-amber-300 dark:hover:bg-amber-700'
                }`}
              />
            ))}
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-stone-900 rounded-xl font-bold shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60 transition-all duration-300 flex items-center space-x-3 mx-auto"
            onClick={() => (window.location.href = '#gallery')}
          >
            <Sparkles className="w-5 h-5" />
            <span>View Full Gallery</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Background Decorations */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-amber-400/20 to-rose-500/20 rounded-full blur-2xl"
      />
      <motion.div
        animate={{
          rotate: [360, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-white/15 to-gray-400/15 rounded-full blur-2xl"
      />
    </section>
  );
};

export default RecentGallery;