import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Play, Pause, ChevronLeft, ChevronRight, X, Download, ExternalLink, Image as ImageIcon, Award, Settings, Users, Star, Search, ChevronDown } from 'lucide-react';
import axios from 'axios';

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
  const [itemsToShow, setItemsToShow] = useState(10);
  const [showViewMore, setShowViewMore] = useState(false);
  const autoPlayRef = useRef();

 

  useEffect(() => {
    fetchAllImages();
  }, []);

  useEffect(() => {
    let filtered = allImages;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Filter by search term
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
    // Reset to showing only 10 items when filters change
    setItemsToShow(10);
  }, [selectedCategory, allImages, searchTerm]);

  // Update displayed items based on itemsToShow
  useEffect(() => {
    setDisplayedItems(filteredItems.slice(0, itemsToShow));
    setShowViewMore(itemsToShow < filteredItems.length);
  }, [filteredItems, itemsToShow]);

  // Fixed Auto-play functionality - using useCallback for stable reference
  const autoPlayCallback = useCallback(() => {
    if (autoPlay && filteredItems.length > 0 && selectedImage) {
      setCurrentIndex(prevIndex => {
        const newIndex = (prevIndex + 1) % filteredItems.length;
        setSelectedImage(filteredItems[newIndex]);
        return newIndex;
      });
    }
  }, [autoPlay, filteredItems, selectedImage]);

  useEffect(() => {
    if (autoPlay && filteredItems.length > 0 && selectedImage) {
      autoPlayRef.current = setInterval(autoPlayCallback, 3000);
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [autoPlay, filteredItems, selectedImage, autoPlayCallback]);

  // Fetch images from all sections (EXCLUDING HERO BACKGROUND)
  const fetchAllImages = async () => {
    try {
      setLoading(true);
      
      // Fetch from multiple endpoints (EXCLUDING HERO)
      const [galleryRes, awardsRes, servicesRes, aboutRes] = await Promise.all([
        axios.get('https://sateesh-kumar-portfolio.onrender.com/api/gallery?limit=100').catch(() => ({ data: [] })),
        axios.get('https://sateesh-kumar-portfolio.onrender.com/api/awards').catch(() => ({ data: [] })),
        axios.get('https://sateesh-kumar-portfolio.onrender.com/api/services').catch(() => ({ data: [] })),
        axios.get('https://sateesh-kumar-portfolio.onrender.com/api/about/sections').catch(() => ({ data: [] }))
      ]);

      const allImagesData = [];
      const uniqueImageUrls = new Set(); // To prevent duplicate images

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
              category: item.category || 'gallery',
              type: 'gallery',
              date: item.createdAt,
              icon: ImageIcon,
              originalItem: item
            });
          }
        });
      }

      // Process award images
      if (awardsRes.data && Array.isArray(awardsRes.data)) {
        awardsRes.data.forEach(award => {
          // Add main image only if unique
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
          
          // Add other award images only if unique
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

      // Process service images
      if (servicesRes.data && Array.isArray(servicesRes.data)) {
        servicesRes.data.forEach(service => {
          // Add main image only if unique
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
          
          // Add other service images only if unique
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
              icon: Users,
              originalItem: section
            });
          }
        });
      }

      // Sort by date (newest first)
      const sortedImages = allImagesData.sort((a, b) => new Date(b.date) - new Date(a.date));

      setAllImages(sortedImages);
      
    } catch (error) {
      console.error('Error fetching all images:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = useCallback((item, index) => {
    // Find the actual index in the FULL filteredItems array for proper navigation
    const actualIndex = filteredItems.findIndex(filteredItem => filteredItem.id === item.id);
    setSelectedImage(item);
    setCurrentIndex(actualIndex);
    setAutoPlay(false); // Stop auto-play when opening lightbox
  }, [filteredItems]);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    setAutoPlay(false); // Stop auto-play when closing lightbox
  }, []);

  const navigateImage = useCallback((direction) => {
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
    if (e) e.stopPropagation(); // Prevent event bubbling
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
    setAutoPlay(false); // Stop auto-play when changing categories
  }, []);

  const handleDownload = useCallback((e, imageUrl) => {
    e.stopPropagation();
    window.open(imageUrl, '_blank');
  }, []);

  const handleViewMore = useCallback(() => {
    // Show all items when "View More" is clicked
    setItemsToShow(filteredItems.length);
  }, [filteredItems.length]);

  // Calculate category counts for display
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

  // Handle keyboard navigation - FIXED VERSION
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
      <section id="gallery" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 dark:border-purple-500 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg">Loading all images...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Complete Gallery
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            All images from awards, services, gallery, and portfolio sections in one place
          </p>
          <div className="mt-4 text-lg text-blue-600 dark:text-blue-400 font-semibold">
            Total Images: {allImages.length}
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search images by title, description, or category..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Category Filter */}
        

        {/* Auto-play Controls */}
        {filteredItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center mb-8"
          >
            <button
              onClick={handleToggleAutoPlay}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all cursor-pointer ${
                autoPlay
                  ? 'bg-green-500 dark:bg-green-600 text-white shadow-lg shadow-green-500/25 dark:shadow-green-500/25'
                  : 'bg-gray-500 dark:bg-gray-600 text-white shadow-lg shadow-gray-500/25 dark:shadow-gray-500/25'
              }`}
            >
              {autoPlay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{autoPlay ? 'Pause Auto-play' : 'Start Auto-play'}</span>
            </button>
          </motion.div>
        )}

        {/* Results Info */}
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-8"
          >
            <p className="text-gray-600 dark:text-gray-300">
              Found {filteredItems.length} images for "{searchTerm}"
            </p>
          </motion.div>
        )}

        {/* Gallery Grid */}
        {displayedItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <ImageIcon className="w-24 h-24 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
              No Images Found
            </h3>
            <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
              {searchTerm 
                ? `No images found for "${searchTerm}". Try different keywords.`
                : selectedCategory === 'all' 
                ? 'No images available in any category.' 
                : `No images found in the ${categories.find(c => c.id === selectedCategory)?.name} category.`}
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {displayedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ 
                      y: -10,
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700"
                    onClick={() => openLightbox(item, index)}
                  >
                    {/* Image */}
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm">
                            <item.icon className="w-3 h-3" />
                            <span className="capitalize">{item.type}</span>
                          </div>
                          <div className="px-3 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm capitalize">
                            {item.category}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-white/80 text-sm line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xs text-white/60">
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                          <ExternalLink className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Type badge in corner */}
                    <div className="absolute top-3 left-3 p-2 bg-black/50 backdrop-blur-sm rounded-full">
                      <item.icon className="w-4 h-4 text-white" />
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
                <button
                  onClick={handleViewMore}
                  className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                >
                  <span>View All {filteredItems.length} Images</span>
                  <ChevronDown className="w-5 h-5 transform group-hover:translate-y-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {/* Showing X of Y indicator */}
            {filteredItems.length > 10 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-8 text-gray-600 dark:text-gray-400"
              >
                <p>
                  Showing {Math.min(itemsToShow, filteredItems.length)} of {filteredItems.length} images
                  {itemsToShow < filteredItems.length && ` (${filteredItems.length - itemsToShow} more hidden)`}
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
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-6xl max-h-full w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image */}
                <div className="relative rounded-3xl overflow-hidden bg-black">
                  <motion.img
                    key={selectedImage.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    className="max-w-full max-h-[80vh] object-contain mx-auto"
                  />
                  
                  {/* Image Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8 text-white">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                        <selectedImage.icon className="w-4 h-4" />
                        <span className="capitalize">{selectedImage.type}</span>
                      </div>
                      <div className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm capitalize">
                        {selectedImage.category}
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold mb-2">{selectedImage.title}</h3>
                    <p className="text-white/80 text-lg mb-4">{selectedImage.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">
                        Added: {new Date(selectedImage.date).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={(e) => handleDownload(e, selectedImage.image)}
                          className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                {filteredItems.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage('prev');
                      }}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 cursor-pointer"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage('next');
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 cursor-pointer"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Close Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeLightbox();
                  }}
                  className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Auto-play Toggle in Lightbox */}
                {filteredItems.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleAutoPlay(e);
                    }}
                    className="absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 cursor-pointer"
                  >
                    {autoPlay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                )}

                {/* Image Counter */}
                {filteredItems.length > 1 && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
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