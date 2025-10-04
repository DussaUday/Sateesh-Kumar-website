import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, Play, Pause, Image as ImageIcon, Award, Settings, Users, Star } from 'lucide-react'
import axios from 'axios'

const RecentGallery = () => {
  const { t } = useTranslation()
  const [allImages, setAllImages] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [loading, setLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    fetchAllImages()
  }, [])

  useEffect(() => {
    let interval
    if (isPlaying && allImages.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % allImages.length)
        setImageLoaded(false)
      }, 4000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, allImages.length])

  // Function to detect image aspect ratio and adjust display
  const handleImageLoad = (event) => {
    const img = event.target
    const width = img.naturalWidth
    const height = img.naturalHeight
    const aspectRatio = width / height
    
    setImageDimensions({ width, height, aspectRatio })
    setImageLoaded(true)
  }

  // Get appropriate object fit based on aspect ratio
  const getObjectFit = (aspectRatio) => {
    if (aspectRatio > 1.5) {
      return 'object-cover' // Very wide images - cover to fill space
    } else if (aspectRatio < 0.7) {
      return 'object-contain' // Very tall images (phone ratios) - contain to show full image
    } else {
      return 'object-contain' // Normal ratios - contain to show full image
    }
  }

  // Get appropriate max height based on aspect ratio
  const getMaxHeight = (aspectRatio) => {
    if (aspectRatio < 0.7) {
      return 'max-h-[70vh]' // Tall phone images - give more height
    } else if (aspectRatio > 1.8) {
      return 'max-h-[50vh]' // Very wide images - limit height
    } else {
      return 'max-h-[60vh]' // Normal images - balanced height
    }
  }

  // Get padding for content based on image aspect ratio
  const getContentPadding = (aspectRatio) => {
    if (aspectRatio < 0.7) {
      return 'p-6 md:p-8' // Tall images - more padding
    } else {
      return 'p-4 md:p-6' // Normal images - standard padding
    }
  }

  // Fetch images from all sections (EXCLUDING HERO BACKGROUND)
  const fetchAllImages = async () => {
    try {
      setLoading(true)
      
      const [galleryRes, awardsRes, servicesRes, aboutRes] = await Promise.all([
        axios.get('https://sateesh-kumar-portfolio.onrender.com/api/gallery?limit=50').catch(() => ({ data: [] })),
        axios.get('https://sateesh-kumar-portfolio.onrender.com/api/awards').catch(() => ({ data: [] })),
        axios.get('https://sateesh-kumar-portfolio.onrender.com/api/services').catch(() => ({ data: [] })),
        axios.get('https://sateesh-kumar-portfolio.onrender.com/api/about/sections').catch(() => ({ data: [] }))
      ])

      const allImagesData = []
      const uniqueImageUrls = new Set() // To track unique images

      // Process gallery images
      if (galleryRes.data && Array.isArray(galleryRes.data)) {
        galleryRes.data.forEach(item => {
          if (item.image && !uniqueImageUrls.has(item.image)) {
            uniqueImageUrls.add(item.image)
            allImagesData.push({
              id: item._id,
              image: item.image,
              title: item.title,
              description: item.description,
              category: item.category,
              type: 'gallery',
              date: item.createdAt,
              icon: ImageIcon
            })
          }
        })
      }

      // Process award images
      if (awardsRes.data && Array.isArray(awardsRes.data)) {
        awardsRes.data.forEach(award => {
          // Only add main image if it's unique
          if (award.mainImage && !uniqueImageUrls.has(award.mainImage)) {
            uniqueImageUrls.add(award.mainImage)
            allImagesData.push({
              id: award._id + '-main',
              image: award.mainImage,
              title: `${award.title} - Main Award Image`,
              description: award.description,
              category: 'awards',
              type: 'award',
              date: award.createdAt,
              icon: Award
            })
          }
          
          // Process other award images
          if (award.images && Array.isArray(award.images)) {
            award.images.forEach((img, index) => {
              if (img.url && !uniqueImageUrls.has(img.url)) {
                uniqueImageUrls.add(img.url)
                allImagesData.push({
                  id: award._id + '-img-' + index,
                  image: img.url,
                  title: img.title || `${award.title} - Award Image`,
                  description: award.description,
                  category: 'awards',
                  type: 'award',
                  date: award.createdAt,
                  icon: Award
                })
              }
            })
          }
        })
      }

      // Process service images
      if (servicesRes.data && Array.isArray(servicesRes.data)) {
        servicesRes.data.forEach(service => {
          // Only add main image if it's unique
          if (service.mainImage && !uniqueImageUrls.has(service.mainImage)) {
            uniqueImageUrls.add(service.mainImage)
            allImagesData.push({
              id: service._id + '-main',
              image: service.mainImage,
              title: `${service.title} - Main Service Image`,
              description: service.description,
              category: 'services',
              type: 'service',
              date: service.createdAt,
              icon: Settings
            })
          }
          
          // Process other service images
          if (service.images && Array.isArray(service.images)) {
            service.images.forEach((img, index) => {
              if (img.url && !uniqueImageUrls.has(img.url)) {
                uniqueImageUrls.add(img.url)
                allImagesData.push({
                  id: service._id + '-img-' + index,
                  image: img.url,
                  title: img.title || `${service.title} - Service Image`,
                  description: service.description,
                  category: 'services',
                  type: 'service',
                  date: service.createdAt,
                  icon: Settings
                })
              }
            })
          }
        })
      }

      // Process about section images
      if (aboutRes.data && Array.isArray(aboutRes.data)) {
        aboutRes.data.forEach(section => {
          if (section.image && !uniqueImageUrls.has(section.image)) {
            uniqueImageUrls.add(section.image)
            allImagesData.push({
              id: section._id,
              image: section.image,
              title: section.title,
              description: section.content,
              category: 'about',
              type: 'about',
              date: section.createdAt,
              icon: Users
            })
          }
        })
      }

      // NOTE: HERO BACKGROUND IMAGE IS INTENTIONALLY EXCLUDED

      const sortedImages = allImagesData
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 12)

      setAllImages(sortedImages)
      
    } catch (error) {
      console.error('Error fetching all images:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length)
    setImageLoaded(false)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
    setImageLoaded(false)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
    setImageLoaded(false)
  }

  if (loading) {
    return (
      <section className="relative py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 dark:border-purple-500 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-4">Loading recent images...</p>
          </div>
        </div>
      </section>
    )
  }

  if (allImages.length === 0) {
    return null
  }

  const currentImage = allImages[currentIndex]
  const objectFitClass = imageLoaded ? getObjectFit(imageDimensions.aspectRatio) : 'object-cover'
  const maxHeightClass = imageLoaded ? getMaxHeight(imageDimensions.aspectRatio) : 'max-h-[60vh]'
  const contentPaddingClass = imageLoaded ? getContentPadding(imageDimensions.aspectRatio) : 'p-4 md:p-6'

  return (
    <section className="relative py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Recent Moments
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Latest images from awards, services, events, and community activities
          </p>
        </motion.div>
        
        {/* Main Carousel - Flexible Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Carousel Container with Dynamic Height */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-200 dark:bg-gray-800 min-h-[300px] md:min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center w-full h-full"
              >
                {/* Image Container with Dynamic Sizing */}
                <div className={`w-full ${maxHeightClass} flex items-center justify-center bg-gray-100 dark:bg-gray-900`}>
                  <img
                    src={currentImage?.image}
                    alt={currentImage?.title}
                    className={`w-full h-full ${objectFitClass} transition-all duration-500`}
                    onLoad={handleImageLoad}
                  />
                </div>
                
                {/* Loading State */}
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-purple-500"></div>
                  </div>
                )}
                
                {/* Gradient Overlay - Dynamic based on image aspect ratio */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent ${
                    imageDimensions.aspectRatio > 1.5 ? 'via-black/10' : 'via-black/40'
                  }`}
                />
                
                {/* Content Overlay - Responsive positioning */}
                <div className={`absolute bottom-0 left-0 right-0 ${contentPaddingClass} text-white ${
                  imageDimensions.aspectRatio < 0.8 ? 'bg-gradient-to-t from-black/80 to-transparent' : ''
                }`}>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <div className="flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                      {currentImage?.icon && (
                        <currentImage.icon className="w-3 h-3 md:w-4 md:h-4" />
                      )}
                      <span className="text-xs md:text-sm font-medium capitalize">{currentImage?.type}</span>
                    </div>
                    <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                      <span className="text-xs md:text-sm font-medium capitalize">{currentImage?.category}</span>
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 line-clamp-2">
                    {currentImage?.title}
                  </h3>
                  <p className="text-white/80 text-sm md:text-base line-clamp-2">
                    {currentImage?.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="absolute inset-0 flex items-center justify-between p-3 md:p-4">
              <button
                onClick={prevSlide}
                className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 transform hover:scale-110 cursor-pointer z-10"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 transform hover:scale-110 cursor-pointer z-10"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                ) : (
                  <Play className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                )}
              </button>
              
              <button
                onClick={nextSlide}
                className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 transform hover:scale-110 cursor-pointer z-10"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
              </button>
            </div>

            {/* Image Counter */}
            <div className="absolute top-3 right-3 md:top-4 md:right-4 px-2 py-1 md:px-3 md:py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs md:text-sm z-10">
              {currentIndex + 1} / {allImages.length}
            </div>
          </div>

          {/* Thumbnail Strip - Improved Layout */}
          <div className="mt-6 px-2 md:px-4">
            <div className="flex space-x-2 md:space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {allImages.map((item, index) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 relative rounded-lg md:rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                    index === currentIndex 
                      ? 'border-blue-500 dark:border-purple-500 scale-105 shadow-lg shadow-blue-500/25 dark:shadow-purple-500/25' 
                      : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => goToSlide(index)}
                >
                  {/* Adaptive thumbnail sizing */}
                  <div className="w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Active indicator */}
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-blue-500/20 dark:bg-purple-500/20" />
                  )}
                  
                  {/* Type icon overlay */}
                  <div className="absolute top-1 left-1 p-0.5 md:p-1 bg-black/50 rounded-full">
                    <item.icon className="w-2 h-2 md:w-3 md:h-3 text-white" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-1.5 md:space-x-2 mt-4">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentIndex 
                    ? 'bg-blue-500 dark:bg-purple-500 scale-125' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-3 h-3 md:w-4 md:h-4" />
              <span>{allImages.length} Recent Images</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-3 h-3 md:w-4 md:h-4" />
              <span>Multiple Sources</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-3 h-3 md:w-4 md:h-4" />
              <span>Auto-updating</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-200 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
    </section>
  )
}

export default RecentGallery