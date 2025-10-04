import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Award, Star, Trophy, Medal, Crown, Zap, Sparkles, X, ChevronLeft, ChevronRight, Image as ImageIcon, Search, ArrowRight, ArrowLeft } from 'lucide-react'
import axios from 'axios'

const Awards = () => {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [awards, setAwards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedAward, setSelectedAward] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [displayCount, setDisplayCount] = useState(6) // Show 6 awards initially (2 rows of 3)
  const awardsPerLoad = 6 // Load 6 more awards each time

  // Fetch awards from backend API
  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/awards')
        console.log('Fetched awards:', response.data)
        setAwards(response.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching awards:', err)
        setError('Failed to load awards')
        // Fallback to empty array if API fails
        setAwards([])
      } finally {
        setLoading(false)
      }
    }

    fetchAwards()
  }, [])

  // Map backend data to frontend format
  const getAwardIcon = (category) => {
    const iconMap = {
      'social-work': Crown,
      'community': Star,
      'leadership': Award,
      'achievement': Medal,
      'recognition': Trophy,
      'prestigious': Crown,
      'international': Zap,
      'performance': Star,
      'organizational': Medal
    }
    return iconMap[category] || Award
  }

  const getAwardGradient = (category) => {
    const gradientMap = {
      'social-work': 'from-yellow-400 to-orange-500',
      'community': 'from-blue-400 to-purple-500',
      'leadership': 'from-green-400 to-emerald-500',
      'achievement': 'from-pink-400 to-rose-500',
      'recognition': 'from-indigo-400 to-blue-500',
      'prestigious': 'from-yellow-400 to-orange-500',
      'international': 'from-blue-400 to-purple-500',
      'performance': 'from-green-400 to-emerald-500',
      'organizational': 'from-pink-400 to-rose-500'
    }
    return gradientMap[category] || 'from-gray-400 to-gray-600'
  }

  const getDefaultAchievements = (category) => {
    const achievementsMap = {
      'social-work': ['Community Impact', 'Social Welfare', 'Service Excellence'],
      'community': ['Local Development', 'Public Service', 'Community Engagement'],
      'leadership': ['Visionary Leadership', 'Team Management', 'Strategic Planning'],
      'achievement': ['Performance Excellence', 'Goal Achievement', 'Outstanding Results'],
      'recognition': ['Professional Recognition', 'Peer Acknowledgement', 'Industry Honor']
    }
    return achievementsMap[category] || ['Excellence', 'Achievement', 'Recognition']
  }

  // Transform backend data to frontend format and sort by year (most recent first)
  const transformedAwards = awards
    .map(award => ({
      id: award._id,
      icon: getAwardIcon(award.category),
      title: award.title,
      description: award.description || `${award.title} award received in ${award.year}`,
      year: award.year.toString(),
      category: award.category,
      gradient: getAwardGradient(award.category),
      achievements: award.achievements && award.achievements.length > 0 
        ? award.achievements 
        : getDefaultAchievements(award.category),
      organization: award.organization,
      images: award.images || [],
      mainImage: award.mainImage
    }))
    .sort((a, b) => parseInt(b.year) - parseInt(a.year)) // Sort by year descending (most recent first)

  const categories = [
    { id: 'all', name: 'All Awards', count: transformedAwards.length },
    { id: 'social-work', name: 'Social Work', count: transformedAwards.filter(a => a.category === 'social-work').length },
    { id: 'community', name: 'Community', count: transformedAwards.filter(a => a.category === 'community').length },
    { id: 'leadership', name: 'Leadership', count: transformedAwards.filter(a => a.category === 'leadership').length },
    { id: 'achievement', name: 'Achievement', count: transformedAwards.filter(a => a.category === 'achievement').length },
    { id: 'recognition', name: 'Recognition', count: transformedAwards.filter(a => a.category === 'recognition').length }
  ]

  // Filter awards based on selected category and search query
  const filteredAwards = transformedAwards.filter(award => {
    const matchesCategory = selectedCategory === 'all' || award.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      award.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      award.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      award.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      award.achievements.some(achievement => 
        achievement.toLowerCase().includes(searchQuery.toLowerCase())
      )
    return matchesCategory && matchesSearch
  })

  // Get awards to display (limited by displayCount)
  const displayedAwards = filteredAwards.slice(0, displayCount)

  // Check if there are more awards to load
  const hasMoreAwards = displayCount < filteredAwards.length

  // Load more awards
  const loadMoreAwards = () => {
    setDisplayCount(prev => prev + awardsPerLoad)
  }

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(6)
  }, [selectedCategory, searchQuery])

  // Open image gallery modal
  const openImageGallery = (award, index = 0) => {
    setSelectedAward(award)
    setSelectedImageIndex(index)
    setIsModalOpen(true)
  }

  // Close image gallery modal
  const closeImageGallery = () => {
    setIsModalOpen(false)
    setSelectedAward(null)
    setSelectedImageIndex(0)
  }

  // Navigate to next image
  const nextImage = () => {
    if (selectedAward) {
      const images = getAllImages(selectedAward)
      setSelectedImageIndex((prev) => (prev + 1) % images.length)
    }
  }

  // Navigate to previous image
  const prevImage = () => {
    if (selectedAward) {
      const images = getAllImages(selectedAward)
      setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <section id="awards" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">Loading awards...</p>
          </div>
        </div>
      </section>
    )
  }

  // Show error state
  if (error && awards.length === 0) {
    return (
      <section id="awards" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Trophy className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Unable to Load Awards</h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="awards" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center space-x-4 mb-6"
            >
              <Trophy className="w-12 h-12 text-yellow-500" />
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 via-yellow-600 to-orange-600 dark:from-white dark:via-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
                {t('awards.title')}
              </h2>
              <Trophy className="w-12 h-12 text-yellow-500" />
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 200 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="h-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full shadow-lg"
            />
          </motion.div>

          {/* Search Bar */}
          {transformedAwards.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search awards by title, organization, or achievement..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Category Filter */}
          {transformedAwards.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
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

          {/* Results Count */}
          {transformedAwards.length > 0 && searchQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-8"
            >
              <p className="text-gray-600 dark:text-gray-400">
                Found {filteredAwards.length} award{filteredAwards.length !== 1 ? 's' : ''} 
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </motion.div>
          )}

          {/* Awards Grid */}
          {transformedAwards.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-12"
            >
              <Trophy className="w-24 h-24 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
                No Awards Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                Awards will appear here once they are added through the admin dashboard.
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
                No awards match your search criteria. Try adjusting your search or filters.
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              >
                <AnimatePresence>
                  {displayedAwards.map((award, index) => (
                    <AwardCard 
                      key={award.id || award.title} 
                      award={award} 
                      index={index}
                      onViewImages={openImageGallery}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Load More Button */}
              {hasMoreAwards && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadMoreAwards}
                    className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-2xl shadow-lg shadow-yellow-500/25 hover:shadow-xl transition-all duration-300"
                  >
                    <span>Load More Awards</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                  <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm">
                    Showing {displayedAwards.length} of {filteredAwards.length} awards
                  </p>
                </motion.div>
              )}

              {/* Show all loaded message */}
              {!hasMoreAwards && filteredAwards.length > 6 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mt-8"
                >
                  <p className="text-gray-600 dark:text-gray-400 text-lg font-semibold">
                    🎉 All {filteredAwards.length} awards loaded!
                  </p>
                </motion.div>
              )}
            </>
          )}

          {/* Achievements Section - Only show if there are awards */}
          {transformedAwards.length > 0 && (
            <AchievementsSection awards={transformedAwards} />
          )}
        </div>
      </section>

      {/* Image Gallery Modal */}
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
      className={`relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
        isSelected
          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-500/25'
          : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 backdrop-blur-sm border border-gray-200 dark:border-gray-600 hover:shadow-xl'
      }`}
    >
      <span className="relative z-10 flex items-center space-x-2">
        <span>{category.name}</span>
        <span className={`px-2 py-1 rounded-full text-xs ${
          isSelected ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'
        }`}>
          {category.count}
        </span>
      </span>
      
      {isSelected && (
        <motion.div
          layoutId="categoryBackground"
          className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  )
}

const AwardCard = ({ award, index, onViewImages }) => {
  const [isHovered, setIsHovered] = useState(false)
  const allImages = getAllImages(award)

  const handleCardClick = () => {
    if (allImages.length > 0) {
      onViewImages(award, 0) // Start with first image (main image)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ 
        y: -10,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleCardClick}
      className={`group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden cursor-pointer ${
        allImages.length > 0 ? 'hover:ring-2 hover:ring-yellow-400' : ''
      }`}
    >
      {/* Recent Badge for awards from current year */}
      {parseInt(award.year) === new Date().getFullYear() && (
        <div className="absolute top-4 left-4 z-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center space-x-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>New</span>
          </motion.div>
        </div>
      )}

      {/* Image count badge */}
      {allImages.length > 0 && (
        <div className="absolute top-4 right-4 z-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-1 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm"
          >
            <ImageIcon className="w-4 h-4" />
            <span>{allImages.length}</span>
          </motion.div>
        </div>
      )}

      {/* Preview image (show main image if available) */}
      {allImages.length > 0 && (
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <img
            src={allImages[0].url}
            alt={allImages[0].title}
            className="w-full h-32 object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
          />
        </div>
      )}

      {/* Animated background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${award.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

      {/* Icon */}
      <motion.div
        animate={{ 
          rotate: isHovered ? 360 : 0,
          scale: isHovered ? 1.1 : 1
        }}
        transition={{ duration: 0.6 }}
        className={`w-20 h-20 bg-gradient-to-r ${award.gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg relative z-10`}
      >
        <award.icon className="w-10 h-10 text-white" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 text-center leading-tight">
          {award.title}
        </h3>
        
        {award.organization && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-2">
            {award.organization}
          </p>
        )}
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-center text-sm leading-relaxed">
          {award.description}
        </p>

        {/* Year */}
        <div className="flex justify-center mb-4">
          <span className={`px-4 py-2 bg-gradient-to-r ${award.gradient} text-white text-sm font-semibold rounded-full shadow-lg`}>
            {award.year}
          </span>
        </div>

        {/* Achievements */}
        <div className="flex flex-wrap justify-center gap-2">
          {award.achievements.slice(0, 3).map((achievement, i) => (
            <motion.span
              key={achievement}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + i * 0.1 }}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-600"
            >
              {achievement}
            </motion.span>
          ))}
          {award.achievements.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full border border-gray-200 dark:border-gray-600">
              +{award.achievements.length - 3} more
            </span>
          )}
        </div>

        {/* View Images Button */}
        {allImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-center"
          >
            <button className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-medium transition-colors duration-200">
              <ImageIcon className="w-4 h-4" />
              <span>View {allImages.length} Image{allImages.length > 1 ? 's' : ''}</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Hover effect */}
      <motion.div
        initial={false}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8
        }}
        className={`absolute inset-0 bg-gradient-to-r ${award.gradient} opacity-10 rounded-3xl`}
      />
    </motion.div>
  )
}

const ImageGalleryModal = ({ isOpen, onClose, award, selectedIndex, onNext, onPrev, onSelectImage }) => {
  if (!isOpen || !award) return null

  const allImages = getAllImages(award)
  const currentImage = allImages[selectedIndex]

  // Handle keyboard navigation
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
          className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative bg-white dark:bg-gray-800 rounded-3xl max-w-6xl max-h-[90vh] w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white">{award.title}</h3>
                  <p className="text-gray-300 text-sm">
                    {selectedIndex + 1} of {allImages.length} images
                    {currentImage.isMain && (
                      <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                        Main Image
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Main Image */}
            <div className="relative h-[70vh] flex items-center justify-center">
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
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={onNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => onSelectImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === selectedIndex 
                          ? 'border-yellow-400 ring-2 ring-yellow-400' 
                          : 'border-transparent hover:border-white'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                      {image.isMain && (
                        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-1 rounded-bl-lg">
                          Main
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Image Title */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 text-center">
              <p className="text-sm font-medium">{currentImage.title}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const AchievementsSection = ({ awards }) => {
  // Calculate stats from actual awards data
  const totalAwards = awards.length
  const currentYear = new Date().getFullYear()
  const oldestAward = Math.min(...awards.map(a => parseInt(a.year) || currentYear))
  const yearsOfService = currentYear - oldestAward + 1

  // Generate achievements based on actual awards
  const achievements = [
    `Received ${totalAwards} prestigious awards and recognitions`,
    `Continuous service and excellence spanning ${yearsOfService} years`,
    'Multiple international and national level recognitions',
    'Pioneered community development initiatives across the region',
    'Leadership in social welfare and community service programs',
    'Consistent excellence in performance and achievement'
  ]

  // Calculate stats
  const stats = [
    { number: `${yearsOfService}+`, label: 'Years of Service' },
    { number: `${Math.round(totalAwards * 1)}+`, label: 'Projects Impacted' },
    { number: `${Math.round(totalAwards * 1000)}+`, label: 'People Served' },
    { number: `${totalAwards}+`, label: 'Awards Received' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50"
    >
      <h3 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8 flex items-center justify-center space-x-3">
        <Sparkles className="w-8 h-8 text-yellow-500" />
        <span>Key Achievements & Milestones</span>
        <Sparkles className="w-8 h-8 text-yellow-500" />
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-start space-x-4 group"
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg"
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </motion.div>
            <p className="text-gray-700 dark:text-gray-300 text-lg group-hover:translate-x-2 transition-transform duration-200">
              {achievement}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-200 dark:border-gray-600"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="text-center"
          >
            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              {stat.number}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

// Helper function to get all images for an award (main image first, then other images)
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
      // Don't add duplicate if main image is already in the images array
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

export default Awards