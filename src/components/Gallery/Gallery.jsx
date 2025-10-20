import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Play, Pause, ChevronLeft, ChevronRight, X, Download, ExternalLink, Image as ImageIcon, Award, Settings, Users, Star, Search, ChevronDown, Sparkles, Heart, Clock, MoreHorizontal } from 'lucide-react';
import axios from 'axios';
import html2canvas from 'html2canvas';

const Gallery = () => {
  const { t } = useTranslation();
  const [allImages, setAllImages] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsToShow, setItemsToShow] = useState(12);
  const [showViewMore, setShowViewMore] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const lightboxRef = useRef();

  const categories = [
    { id: 'all', name: 'All Images', icon: Sparkles, color: 'from-amber-500 to-yellow-600' },
    { id: 'awards', name: 'Awards', icon: Award, color: 'from-rose-500 to-maroon-700' },
    { id: 'services', name: 'Services', icon: Settings, color: 'from-blue-500 to-cyan-600' },
    { id: 'gallery', name: 'Gallery', icon: ImageIcon, color: 'from-green-500 to-emerald-600' },
    { id: 'about', name: 'About', icon: Users, color: 'from-purple-500 to-indigo-600' }
  ];

  useEffect(() => {
    fetchAllImages();
  }, []);

  useEffect(() => {
    let filtered = allImages;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.category?.toLowerCase().includes(term) ||
        item.type?.toLowerCase().includes(term)
      );
    }
    
    setFilteredItems(filtered);
    setItemsToShow(12);
  }, [selectedCategory, allImages, searchTerm]);

  useEffect(() => {
    setDisplayedItems(filteredItems.slice(0, itemsToShow));
    setShowViewMore(itemsToShow < filteredItems.length);
  }, [filteredItems, itemsToShow]);

  useEffect(() => {
    if (!autoPlay || filteredItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const newIndex = (prevIndex + 1) % filteredItems.length;
        setSelectedImage(filteredItems[newIndex]);
        return newIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [autoPlay, filteredItems]);

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

      if (galleryRes.data && Array.isArray(galleryRes.data)) {
        galleryRes.data.forEach(item => {
          if (item.image && !uniqueImageUrls.has(item.image)) {
            uniqueImageUrls.add(item.image);
            allImagesData.push({
              id: item._id,
              image: item.image,
              title: item.title,
              description: item.description,
              category: item.category || 'gallery',
              type: 'gallery',
              date: item.createdAt,
              icon: ImageIcon,
              originalItem: item
            });
          }
        });
      }

      if (awardsRes.data && Array.isArray(awardsRes.data)) {
        awardsRes.data.forEach(award => {
          if (award.mainImage && !uniqueImageUrls.has(award.mainImage)) {
            uniqueImageUrls.add(award.mainImage);
            allImagesData.push({
              id: award._id + '-main',
              image: award.mainImage,
              title: `${award.title} - Main Award Image`,
              description: award.description || `${award.title} award received in ${award.year}`,
              category: 'awards',
              type: 'award',
              date: award.createdAt,
              icon: Award,
              originalItem: award
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
                  description: award.description || `${award.title} award image`,
                  category: 'awards',
                  type: 'award',
                  date: award.createdAt,
                  icon: Award,
                  originalItem: award
                });
              }
            });
          }
        });
      }

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
              icon: Settings,
              originalItem: service
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
                  icon: Settings,
                  originalItem: service
                });
              }
            });
          }
        });
      }

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
              icon: Users,
              originalItem: section
            });
          }
        });
      }

      const sortedImages = allImagesData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAllImages(sortedImages);
      
    } catch (error) {
      console.error('Error fetching all images:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = useCallback((item, index) => {
    const actualIndex = filteredItems.findIndex(filteredItem => filteredItem.id === item.id);
    setSelectedImage(item);
    setCurrentIndex(actualIndex);
    setAutoPlay(false);
  }, [filteredItems]);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    setAutoPlay(false);
  }, []);

  const navigateImage = useCallback((direction) => {
    setAutoPlay(false);
    setCurrentIndex(prevIndex => {
      let newIndex;
      if (direction === 'next') {
        newIndex = (prevIndex + 1) % filteredItems.length;
      } else {
        newIndex = (prevIndex - 1 + filteredItems.length) % filteredItems.length;
      }
      setSelectedImage(filteredItems[newIndex]);
      return newIndex;
    });
  }, [filteredItems]);

  const handleToggleAutoPlay = useCallback((e) => {
    if (e) e.stopPropagation();
    setAutoPlay(prev => !prev);
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const handleCategoryClick = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    setAutoPlay(false);
  }, []);

  const handleDownload = useCallback(async (e, imageUrl, imageElement = null) => {
    e.stopPropagation();
    
    try {
      // If we have the image element from lightbox, use html2canvas for high-quality download
      if (imageElement) {
        const canvas = await html2canvas(imageElement, {
          useCORS: true,
          allowTaint: true,
          scale: 2, // Higher quality
          backgroundColor: null
        });
        
        const link = document.createElement('a');
        link.download = `image-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      } else {
        // Fallback to direct download
        window.open(imageUrl, '_blank');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      // Fallback to direct download if html2canvas fails
      window.open(imageUrl, '_blank');
    }
  }, []);

  const handleViewMore = useCallback(() => {
    setItemsToShow(filteredItems.length);
  }, [filteredItems.length]);

  const toggleDescription = useCallback((itemId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  }, []);

  const truncateDescription = useCallback((description, itemId) => {
    if (!description) return '';
    
    const isExpanded = expandedDescriptions[itemId];
    if (isExpanded) return description;
    
    const sentences = description.split('. ');
    if (sentences.length <= 1) {
      return description.length > 80 ? description.substring(0, 80) + '...' : description;
    }
    
    return sentences[0] + (sentences[0].endsWith('.') ? '' : '.');
  }, [expandedDescriptions]);

  const getCategoryCount = useCallback((categoryId) => {
    if (categoryId === 'all') {
      return allImages.filter(item => 
        !searchTerm || 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      ).length;
    }
    return allImages.filter(item => 
      item.category === categoryId && 
      (!searchTerm || 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    ).length;
  }, [allImages, searchTerm]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
        case ' ':
          e.preventDefault();
          setAutoPlay(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, closeLightbox, navigateImage]);

  if (loading) {
    return (
      <section id="gallery" className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-white dark:from-gray-900 dark:via-gray-950 dark:to-black py-20 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-serif">Loading your journey...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-white dark:from-gray-900 dark:via-gray-950 dark:to-black py-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-amber-400/20 dark:bg-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-400/10 to-maroon-700/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-5xl md:text-7xl font-bold mb-6 font-serif"
          >
            <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500 bg-clip-text text-transparent">
              My Journey
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-serif italic"
          >
            A visual narrative of dedication, service, and achievements
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-lg bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent font-semibold"
          >
            {allImages.length} Precious Moments Captured
          </motion.div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search through my journey..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-12 pr-12 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-amber-200 dark:border-amber-800 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 font-serif"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-500 hover:text-amber-600 dark:hover:text-amber-400"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => {
            const IconComponent = category.icon;
            const count = getCategoryCount(category.id);
            
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryClick(category.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 cursor-pointer backdrop-blur-md border ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg border-transparent`
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-amber-200 dark:border-amber-800 hover:shadow-xl'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{category.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  selectedCategory === category.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                }`}>
                  {count}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Auto-play Controls */}
        {filteredItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleAutoPlay}
              className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 cursor-pointer backdrop-blur-md border ${
                autoPlay
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 border-transparent'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-amber-200 dark:border-amber-800 hover:shadow-xl'
              }`}
            >
              {autoPlay ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause Journey</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Auto-play Journey</span>
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Results Info */}
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-8"
          >
            <p className="text-gray-600 dark:text-gray-300 font-serif">
              Discovered {filteredItems.length} moments for "{searchTerm}"
            </p>
          </motion.div>
        )}

        {/* Gallery Grid */}
        {displayedItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-24 h-24 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <ImageIcon className="w-12 h-12 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4 font-serif">
              No Moments Found
            </h3>
            <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto font-serif">
              {searchTerm 
                ? `No memories found for "${searchTerm}". Try different keywords.`
                : 'The journey continues... More moments coming soon.'}
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {displayedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ 
                      y: -8,
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden cursor-pointer border border-amber-200 dark:border-amber-800 hover:shadow-3xl transition-all duration-300"
                    onClick={() => openLightbox(item, index)}
                  >
                    {/* Image Container */}
                    <div className="aspect-square overflow-hidden relative">
                      <motion.img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        whileHover={{ scale: 1.1 }}
                      />
                      
                      {/* Minimal Overlay - No Black Background */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </div>

                    {/* Minimal Content Overlay - Transparent */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-2xl p-4 text-gray-800 dark:text-white border border-white/20 dark:border-gray-600/30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        
                        {/* Minimal Category Badge */}
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center space-x-1 px-2 py-1 bg-amber-500/20 rounded-full text-xs backdrop-blur-sm border border-amber-400/30">
                            <item.icon className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            <span className="capitalize font-medium text-amber-700 dark:text-amber-300">{item.type}</span>
                          </div>
                        </div>
                        
                        {/* Title Only - Minimal */}
                        <h3 className="text-sm font-bold mb-1 line-clamp-1 font-serif text-gray-800 dark:text-white">
                          {item.title}
                        </h3>
                        
                        {/* Minimal Date */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {new Date(item.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                          <MoreHorizontal className="w-3 h-3 text-amber-500" />
                        </div>
                      </div>
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-3 left-3 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-amber-200 dark:border-amber-700">
                      <item.icon className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    </div>

                    {/* Mobile Content (Always Visible) */}
                    <div className="p-3 md:hidden">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1 px-2 py-1 bg-amber-500/10 rounded-full text-xs">
                          <item.icon className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          <span className="capitalize text-amber-600 dark:text-amber-400 font-medium text-xs">{item.type}</span>
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1 line-clamp-1 font-serif">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2 mb-1">
                        {truncateDescription(item.description, item.id)}
                      </p>
                      {item.description && item.description.split('. ').length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDescription(item.id);
                          }}
                          className="text-amber-500 hover:text-amber-600 text-xs font-medium flex items-center space-x-1"
                        >
                          <span className="text-xs">{expandedDescriptions[item.id] ? 'Read Less' : '...More'}</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* View More Button */}
            {showViewMore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewMore}
                  className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer backdrop-blur-md border border-amber-400/30 group"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Discover All {filteredItems.length} Moments</span>
                  <ChevronDown className="w-5 h-5 transform group-hover:translate-y-1 transition-transform" />
                </motion.button>
              </motion.div>
            )}

            {/* Showing X of Y indicator */}
            {filteredItems.length > 12 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-8 text-gray-600 dark:text-gray-400 font-serif"
              >
                <p>
                  Showing {Math.min(itemsToShow, filteredItems.length)} of {filteredItems.length} precious moments
                  {itemsToShow < filteredItems.length && ` (${filteredItems.length - itemsToShow} more to explore)`}
                </p>
              </motion.div>
            )}
          </>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 dark:bg-black/97 backdrop-blur-xl z-50 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotate: 5 }}
                transition={{ type: "spring", damping: 25 }}
                className="relative max-w-6xl max-h-full w-full"
                onClick={(e) => e.stopPropagation()}
                ref={lightboxRef}
              >
                {/* Image Container - Minimal Text Overlay */}
                <div className="relative rounded-3xl overflow-hidden bg-black border border-amber-500/30">
                  <motion.img
                    key={selectedImage.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    className="max-w-full max-h-[80vh] object-contain mx-auto"
                    ref={lightboxRef}
                  />
                  
                  {/* Minimal Image Info - Only Essential Details */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-4 text-white">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div className="flex items-center space-x-2 px-3 py-1 bg-amber-500/20 rounded-full text-sm backdrop-blur-sm border border-amber-400/30">
                        <selectedImage.icon className="w-3 h-3" />
                        <span className="capitalize font-medium text-xs">{selectedImage.type}</span>
                      </div>
                    </div>
                    
                    {/* Title Only - Minimal */}
                    <h3 className="text-lg md:text-xl font-bold mb-1 font-serif line-clamp-1">
                      {selectedImage.title}
                    </h3>
                    
                    {/* Minimal Description with Read More */}
                    <div className="mb-3">
                      <p className="text-white/80 text-sm line-clamp-2">
                        {truncateDescription(selectedImage.description, selectedImage.id)}
                      </p>
                      {selectedImage.description && selectedImage.description.split('. ').length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDescription(selectedImage.id);
                          }}
                          className="text-amber-300 hover:text-amber-200 text-xs font-medium mt-1 flex items-center space-x-1"
                        >
                          <span>{expandedDescriptions[selectedImage.id] ? 'Read Less' : '...More'}</span>
                          <ChevronDown 
                            className={`w-3 h-3 transition-transform ${
                              expandedDescriptions[selectedImage.id] ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                      )}
                    </div>
                    
                    {/* Minimal Footer */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <span className="text-white/60 text-xs">
                        {new Date(selectedImage.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            const imageElement = lightboxRef.current?.querySelector('img');
                            handleDownload(e, selectedImage.image, imageElement);
                          }}
                          className="flex items-center space-x-2 px-3 py-2 bg-amber-500/20 rounded-full backdrop-blur-sm border border-amber-400/30 hover:bg-amber-500/30 transition-colors cursor-pointer text-amber-300 text-sm"
                        >
                          <Download className="w-3 h-3" />
                          <span className="font-medium">Download</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                {filteredItems.length > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage('prev');
                      }}
                      className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/30 cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage('next');
                      }}
                      className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/30 cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </motion.button>
                  </>
                )}

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    closeLightbox();
                  }}
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/30 cursor-pointer"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>

                {/* Auto-play Toggle in Lightbox */}
                {filteredItems.length > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleAutoPlay(e);
                    }}
                    className="absolute top-2 sm:top-4 left-2 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/30 cursor-pointer"
                  >
                    {autoPlay ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </motion.button>
                )}

                {/* Image Counter */}
                {filteredItems.length > 1 && (
                  <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 px-3 py-1 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-white border border-white/30 font-medium text-sm">
                    {currentIndex + 1} / {filteredItems.length}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Gallery;