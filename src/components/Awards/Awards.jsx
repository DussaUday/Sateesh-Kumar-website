import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  Award, Star, Trophy, Medal, Crown, Zap, Sparkles, X, 
  ChevronLeft, ChevronRight, Image as ImageIcon, Search, 
  ArrowRight, Filter, Clock, Grid, List, Eye,
  Calendar, Building, MapPin
} from 'lucide-react'
import axios from 'axios'

// Helper function to get all images for an award
const getAllImages = (award) => {
  const images = []
  
  // Add main image first if it exists
  if (award.mainImage) {
    images.push({
      url: award.mainImage,
      title: `${award.title} - Main Image`,
      isMain: true
    })
  }
  
  // Add other images
  if (award.images && award.images.length > 0) {
    award.images.forEach(img => {
      if (img.url !== award.mainImage) {
        images.push({
          url: img.url,
          title: img.title,
          isMain: false
        })
      }
    })
  }
  
  return images
}

const Awards = () => {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [awards, setAwards] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAward, setSelectedAward] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [displayCount, setDisplayCount] = useState(8)
  const [viewMode, setViewMode] = useState('grid')
  const awardsPerLoad = 8

  useEffect(() => {
    fetchAwards()
  }, [])

  const fetchAwards = async () => {
    try {
      setLoading(true)
      const response = await axios.get('https://sateesh-kumar-portfolio.onrender.com/api/awards')
      const transformedData = response.data
        .map(award => ({
          ...award,
          icon: getAwardIcon(award.category),
          gradient: getAwardGradient(award.category),
          allImages: getAllImages(award)
        }))
        .sort((a, b) => parseInt(b.year) - parseInt(a.year))
      
      setAwards(transformedData)
    } catch (err) {
      console.error('Error fetching awards:', err)
      setAwards([])
    } finally {
      setLoading(false)
    }
  }

  const getAwardIcon = (category) => {
    const iconMap = {
      'social-work': Crown, 'community': Award, 'leadership': Trophy, 'achievement': Medal,
      'recognition': Star, 'prestigious': Crown, 'international': Zap, 'performance': Star, 
      'organizational': Medal, 'service': Award, 'excellence': Trophy
    }
    return iconMap[category] || Award
  }

  const getAwardGradient = (category) => {
    const gradientMap = {
      'social-work': 'from-amber-400 to-yellow-600',
      'community': 'from-rose-500 to-maroon-700',
      'leadership': 'from-amber-500 to-orange-600',
      'achievement': 'from-rose-600 to-maroon-800',
      'recognition': 'from-yellow-400 to-amber-600',
      'prestigious': 'from-amber-400 to-yellow-600',
      'international': 'from-rose-500 to-maroon-700',
      'performance': 'from-amber-500 to-orange-600',
      'organizational': 'from-rose-600 to-maroon-800',
      'service': 'from-yellow-400 to-amber-600',
      'excellence': 'from-amber-400 to-yellow-600'
    }
    return gradientMap[category] || 'from-amber-400 to-yellow-600'
  }

  const categories = useMemo(() => ([
    { id: 'all', name: 'All Awards', count: awards.length },
    { id: 'social-work', name: 'Social Work', count: awards.filter(a => a.category === 'social-work').length },
    { id: 'community', name: 'Community', count: awards.filter(a => a.category === 'community').length },
    { id: 'leadership', name: 'Leadership', count: awards.filter(a => a.category === 'leadership').length },
    { id: 'achievement', name: 'Achievement', count: awards.filter(a => a.category === 'achievement').length },
    { id: 'recognition', name: 'Recognition', count: awards.filter(a => a.category === 'recognition').length }
  ]), [awards])

  const filteredAwards = useMemo(() => {
    return awards.filter(award => {
      const matchesCategory = selectedCategory === 'all' || award.category === selectedCategory
      const matchesSearch = searchQuery === '' || 
        award.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        award.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        award.description?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [awards, selectedCategory, searchQuery])

  const displayedAwards = filteredAwards.slice(0, displayCount)
  const hasMoreAwards = displayCount < filteredAwards.length

  const loadMoreAwards = () => {
    setDisplayCount(prev => prev + awardsPerLoad)
  }

  useEffect(() => {
    setDisplayCount(8)
  }, [selectedCategory, searchQuery])

  const openImageGallery = (award, index = 0) => {
    setSelectedAward(award)
    setSelectedImageIndex(index)
    setIsModalOpen(true)
  }

  const closeImageGallery = () => {
    setIsModalOpen(false)
    setSelectedAward(null)
    setSelectedImageIndex(0)
  }

  const nextImage = () => {
    if (selectedAward) {
      setSelectedImageIndex((prev) => (prev + 1) % selectedAward.allImages.length)
    }
  }

  const prevImage = () => {
    if (selectedAward) {
      setSelectedImageIndex((prev) => (prev - 1 + selectedAward.allImages.length) % selectedAward.allImages.length)
    }
  }

  if (loading) {
    return (
      <section id="awards" className="relative py-16 bg-gradient-to-br from-stone-50 via-stone-100 to-white dark:from-gray-900 dark:via-gray-950 dark:to-black overflow-hidden min-h-[60vh] flex items-center justify-center">
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
          <p className="text-gray-600 dark:text-gray-300 font-serif text-lg">Loading awards...</p>
        </motion.div>
      </section>
    )
  }

  return (
    <>
      <section id="awards" className="relative py-16 bg-gradient-to-br from-stone-50 via-stone-100 to-white dark:from-gray-900 dark:via-gray-950 dark:to-black overflow-hidden">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-amber-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black font-serif text-gray-800 dark:text-white mb-4"
            >
              <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Awards & Achievements
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-serif italic"
            >
              "Celebrating excellence and dedicated service to the community"
            </motion.p>

            {/* Search and Controls */}
            {awards.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="max-w-4xl mx-auto mt-8"
              >
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                  {/* Search Input */}
                  <div className="relative flex-1 w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search awards..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-amber-200/50 dark:border-amber-700/30 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode('grid')}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-2xl transition-all duration-300 ${
                        viewMode === 'grid' 
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/25' 
                          : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 border border-amber-200/50 dark:border-amber-700/30'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                      <span className="hidden sm:inline">Grid</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode('list')}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-2xl transition-all duration-300 ${
                        viewMode === 'list' 
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/25' 
                          : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 border border-amber-200/50 dark:border-amber-700/30'
                      }`}
                    >
                      <List className="w-4 h-4" />
                      <span className="hidden sm:inline">List</span>
                    </motion.button>
                  </div>
                </div>

                {/* Results Count */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-500 dark:text-gray-400 mt-4 text-sm"
                >
                  Showing {displayedAwards.length} of {filteredAwards.length} awards
                  {searchQuery && ` for "${searchQuery}"`}
                </motion.p>
              </motion.div>
            )}
          </motion.div>

          {/* Category Filters */}
          {awards.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap justify-center gap-3 mb-8 px-2"
            >
              {categories.map((category) => (
                <CategoryButton
                  key={category.id}
                  category={category}
                  isSelected={selectedCategory === category.id}
                  onClick={() => setSelectedCategory(category.id)}
                />
              ))}
            </motion.div>
          )}

          {awards.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-12"
            >
              <Award className="w-24 h-24 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
                No Awards Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                Awards will appear here once they are added.
              </p>
            </motion.div>
          ) : filteredAwards.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-12"
            >
              <Search className="w-24 h-24 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
                No Awards Found
              </h3>
              <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                Try adjusting your search or filters.
              </p>
            </motion.div>
          ) : (
            <>
              {/* Awards Grid/List */}
              <div className="max-w-7xl mx-auto">
                {viewMode === 'grid' ? (
                  <AwardsGridView 
                    awards={displayedAwards}
                    onViewImages={openImageGallery}
                  />
                ) : (
                  <AwardsListView 
                    awards={displayedAwards}
                    onViewImages={openImageGallery}
                  />
                )}

                {/* Load More Button */}
                {hasMoreAwards && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mt-12"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={loadMoreAwards}
                      className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-400 mx-auto"
                    >
                      <Eye className="w-5 h-5" />
                      <span className="font-semibold">Load More Awards</span>
                    </motion.button>
                  </motion.div>
                )}

                {!hasMoreAwards && filteredAwards.length > 8 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mt-8"
                  >
                    <p className="text-gray-600 dark:text-gray-400 text-lg font-semibold">
                      All {filteredAwards.length} awards loaded
                    </p>
                  </motion.div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <ImageGalleryModal
        isOpen={isModalOpen}
        onClose={closeImageGallery}
        award={selectedAward}
        selectedIndex={selectedImageIndex}
        onNext={nextImage}
        onPrev={prevImage}
        onSelectImage={setSelectedImageIndex}
      />
    </>
  )
}

const CategoryButton = ({ category, isSelected, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative px-4 py-2 rounded-2xl font-medium text-sm transition-all duration-300 ${
        isSelected
          ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/25'
          : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 backdrop-blur-sm border border-amber-200/50 dark:border-amber-700/50 hover:shadow-xl'
      }`}
    >
      <span className="relative z-10 flex items-center space-x-2">
        <span>{category.name}</span>
        <span className={`px-2 py-1 rounded-full text-xs ${
          isSelected ? 'bg-white/20' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
        }`}>
          {category.count}
        </span>
      </span>
    </motion.button>
  )
}

const AwardsGridView = ({ awards, onViewImages }) => {
  return (
    <motion.div 
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2"
    >
      <AnimatePresence>
        {awards.map((award, index) => (
          <AwardGridCard
            key={award._id}
            award={award}
            index={index}
            onViewImages={onViewImages}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

const AwardsListView = ({ awards, onViewImages }) => {
  return (
    <motion.div layout className="space-y-4 px-2">
      <AnimatePresence>
        {awards.map((award, index) => (
          <AwardListCard
            key={award._id}
            award={award}
            index={index}
            onViewImages={onViewImages}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

const AwardGridCard = ({ award, index, onViewImages }) => {
  const [isHovered, setIsHovered] = useState(false)
  const hasImages = award.allImages.length > 0
  const mainImage = hasImages ? award.allImages[0] : null

  const handleCardClick = () => {
    if (hasImages) {
      onViewImages(award, 0)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleCardClick}
      className={`group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer border border-amber-200/50 dark:border-amber-700/50 shadow-lg hover:shadow-xl transition-all duration-300 ${
        hasImages ? 'hover:ring-2 hover:ring-amber-400' : ''
      }`}
    >
      {/* Image Section - Always show if available */}
      {hasImages && mainImage && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={mainImage.url}
            alt={award.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          {/* Image Count Badge */}
          {award.allImages.length > 1 && (
            <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm flex items-center space-x-1">
              <ImageIcon className="w-3 h-3" />
              <span>{award.allImages.length}</span>
            </div>
          )}

          {/* Year Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 bg-gradient-to-r ${award.gradient} text-white text-sm font-semibold rounded-full shadow-lg flex items-center space-x-1`}>
              <Calendar className="w-3 h-3" />
              <span>{award.year}</span>
            </span>
          </div>

          {/* New Badge */}
          {parseInt(award.year) === new Date().getFullYear() && (
            <div className="absolute top-12 left-3">
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>New</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="p-4">
        {/* Icon and Title */}
        <div className="flex items-center space-x-3 mb-3">
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0, scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
            className={`w-12 h-12 bg-gradient-to-r ${award.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}
          >
            <award.icon className="w-6 h-6 text-white" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-2 leading-tight">
              {award.title}
            </h3>
            {award.organization && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 flex items-center space-x-1">
                <Building className="w-3 h-3" />
                <span>{award.organization}</span>
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3 leading-relaxed">
          {award.description}
        </p>

        {/* View Images Button */}
        {hasImages && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <button className="inline-flex items-center space-x-2 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-sm font-medium transition-colors duration-200">
              <ImageIcon className="w-4 h-4" />
              <span>View Images</span>
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

const AwardListCard = ({ award, index, onViewImages }) => {
  const hasImages = award.allImages.length > 0
  const mainImage = hasImages ? award.allImages[0] : null

  const handleCardClick = () => {
    if (hasImages) {
      onViewImages(award, 0)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ x: 5 }}
      className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl cursor-pointer border border-amber-200/50 dark:border-amber-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
      onClick={handleCardClick}
    >
      <div className="flex items-center p-4">
        {/* Image Thumbnail - Always show if available */}
        {hasImages && mainImage && (
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 mr-4 border border-amber-200/50">
            <img
              src={mainImage.url}
              alt={award.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Icon */}
        <div className={`w-12 h-12 bg-gradient-to-r ${award.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 mr-4`}>
          <award.icon className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-1">
                {award.title}
              </h3>
              {parseInt(award.year) === new Date().getFullYear() && (
                <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                  NEW
                </span>
              )}
            </div>
            <span className={`px-3 py-1 bg-gradient-to-r ${award.gradient} text-white text-sm font-semibold rounded-full flex-shrink-0 ml-2 flex items-center space-x-1`}>
              <Calendar className="w-3 h-3" />
              <span>{award.year}</span>
            </span>
          </div>
          
          {award.organization && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2 line-clamp-1 flex items-center space-x-1">
              <Building className="w-3 h-3" />
              <span>{award.organization}</span>
            </p>
          )}
          
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
            {award.description}
          </p>
        </div>

        {/* Arrow and Image Count */}
        <div className="flex items-center space-x-2 ml-4">
          {hasImages && (
            <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 text-sm">
              <ImageIcon className="w-4 h-4" />
              <span className="text-xs">{award.allImages.length}</span>
            </div>
          )}
          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
            className="text-amber-500"
          >
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

const ImageGalleryModal = ({ isOpen, onClose, award, selectedIndex, onNext, onPrev, onSelectImage }) => {
  if (!isOpen || !award) return null

  const allImages = award.allImages
  const currentImage = allImages[selectedIndex]

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNext, onPrev])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Section */}
            <div className="relative flex-1 flex items-center justify-center bg-black p-4 md:p-8">
              <div className="relative w-full h-full flex items-center justify-center">
                <motion.img
                  key={selectedIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  src={currentImage.url}
                  alt={currentImage.title}
                  className="max-h-full max-w-full object-contain"
                />
                
                {/* Navigation Arrows */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={onPrev}
                      className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 p-2 md:p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200 z-10"
                    >
                      <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <button
                      onClick={onNext}
                      className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 p-2 md:p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200 z-10"
                    >
                      <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  {selectedIndex + 1} / {allImages.length}
                </div>
              </div>
            </div>

            {/* Information Panel */}
            <div className="w-full md:w-96 flex flex-col bg-white dark:bg-gray-800 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${award.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                    <award.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-2">
                      {award.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {currentImage.title}
                    </p>
                  </div>
                </div>

                {/* Award Details */}
                <div className="space-y-2">
                  {award.organization && (
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <Building className="w-4 h-4" />
                      <span className="text-sm">{award.organization}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{award.year}</span>
                  </div>
                  {award.location && (
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{award.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Description</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {award.description}
                </p>
              </div>

              {/* Thumbnail Strip */}
              {allImages.length > 1 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm">
                    All Images ({allImages.length})
                  </h4>
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => onSelectImage(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          index === selectedIndex 
                            ? 'border-amber-400 ring-2 ring-amber-400' 
                            : 'border-transparent hover:border-amber-300'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Awards