import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets, BookOpen, Heart, Users, ArrowRight, Sparkles, X, 
  ChevronLeft, ChevronRight, Target, HeartHandshake, Globe, Shield,
  Search, Calendar, Filter, ArrowDown, ArrowUp, Clock
} from 'lucide-react';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [activeService, setActiveService] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState('date'); // Default to date sorting
  const [sortOrder, setSortOrder] = useState('desc'); // Default to descending (newest first)

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterAndSortServices();
  }, [services, searchTerm, sortBy, sortOrder]);

  const fetchServices = async () => {
    try {
      const response = await axios.get('https://sateesh-kumar-portfolio.onrender.com/api/services');
      // Sort services by date (newest first) immediately after fetching
      const sortedServices = response.data.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || new Date());
        const dateB = new Date(b.createdAt || b.updatedAt || new Date());
        return dateB - dateA; // Newest first
      });
      setServices(sortedServices);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
    }
  };

  const filterAndSortServices = () => {
    let filtered = services.filter(service =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.features?.some(feature => 
        feature.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Sort services based on current sort criteria
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt || a.updatedAt || new Date());
          bValue = new Date(b.createdAt || b.updatedAt || new Date());
          break;
        case 'name':
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredServices(filtered);
    // Reset active service to first one when filtering/sorting changes
    if (filtered.length > 0) {
      setActiveService(0);
    }
  };

  const getIcon = (iconName) => {
    switch(iconName) {
      case 'Droplets': return Droplets;
      case 'BookOpen': return BookOpen;
      case 'Heart': return Heart;
      case 'Users': return Users;
      case 'Target': return Target;
      case 'HeartHandshake': return HeartHandshake;
      case 'Globe': return Globe;
      case 'Shield': return Shield;
      default: return HeartHandshake;
    }
  };

  const nextImage = () => {
    if (selectedImage && filteredServices[activeService]?.images) {
      setCurrentImageIndex((prev) => 
        (prev + 1) % filteredServices[activeService].images.length
      );
    }
  };

  const prevImage = () => {
    if (selectedImage && filteredServices[activeService]?.images) {
      setCurrentImageIndex((prev) => 
        (prev - 1 + filteredServices[activeService].images.length) % filteredServices[activeService].images.length
      );
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      // Set default order based on field
      setSortOrder(field === 'date' ? 'desc' : 'asc');
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      const months = Math.floor(diffInDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
  };

  const displayedServices = showAll ? filteredServices : filteredServices.slice(0, 4);

  // Floating animation variants
  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (loading) {
    return (
      <section id="services" className="min-h-screen py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 dark:text-gray-300 text-lg"
          >
            Loading Services...
          </motion.p>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section id="services" className="min-h-screen py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <HeartHandshake className="w-24 h-24 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
            Services Coming Soon
          </h3>
          <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
            Our services are being prepared with passion and dedication.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="min-h-screen py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          variants={floatingAnimation}
          animate="animate"
          className="absolute top-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20"
        />
        <motion.div
          variants={floatingAnimation}
          animate="animate"
          transition={{ delay: 1 }}
          className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-200 dark:bg-indigo-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20"
        />
        <motion.div
          variants={floatingAnimation}
          animate="animate"
          transition={{ delay: 2 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-10"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-2 border-blue-500 dark:border-blue-400 rounded-full absolute inset-0"
              />
              <HeartHandshake className="w-12 h-12 text-blue-600 dark:text-blue-400 relative z-10" />
            </div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Service is My Passion
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Dedicated to making a difference through compassionate service and community development
          </motion.p>

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              {/* Search Input */}
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search services by name, description, or features..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Sort Buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSort('name')}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-2xl transition-all duration-300 ${
                    sortBy === 'name' 
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                      : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Name</span>
                  {sortBy === 'name' && (
                    sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSort('date')}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-2xl transition-all duration-300 ${
                    sortBy === 'date' 
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                      : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Recent</span>
                  {sortBy === 'date' && (
                    sortOrder === 'desc' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Results Count */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 dark:text-gray-400 mt-4"
            >
              Showing {displayedServices.length} of {filteredServices.length} services
              {searchTerm && ` for "${searchTerm}"`}
              {sortBy === 'date' && ` • Sorted by ${sortOrder === 'desc' ? 'newest' : 'oldest'} first`}
            </motion.p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          {/* Services Grid */}
          <div className="xl:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {displayedServices.map((service, index) => {
                  const IconComponent = getIcon(service.icon);
                  return (
                    <ServiceCard
                      key={service._id}
                      service={service}
                      IconComponent={IconComponent}
                      index={index}
                      isActive={activeService === index}
                      isHovered={hoveredCard === index}
                      onHover={() => setHoveredCard(index)}
                      onLeave={() => setHoveredCard(null)}
                      onClick={() => setActiveService(index)}
                      getTimeAgo={getTimeAgo}
                    />
                  );
                })}
              </AnimatePresence>
            </div>

            {/* View More/Less Button */}
            {filteredServices.length > 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAll(!showAll)}
                  className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="font-semibold">
                    {showAll ? 'Show Less' : `View All ${filteredServices.length} Services`}
                  </span>
                  <motion.div
                    animate={{ rotate: showAll ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowDown className="w-5 h-5" />
                  </motion.div>
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Service Detail Sidebar */}
          <div className="xl:col-span-1">
            <AnimatePresence mode="wait">
              <ServiceDetail 
                key={activeService} 
                service={filteredServices[activeService]} 
                onImageClick={(image, index) => {
                  setSelectedImage(image);
                  setCurrentImageIndex(index);
                }}
                getIcon={getIcon}
                getTimeAgo={getTimeAgo}
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && filteredServices[activeService]?.images && (
            <ImageModal 
              images={filteredServices[activeService].images}
              currentIndex={currentImageIndex}
              onClose={() => setSelectedImage(null)}
              onNext={nextImage}
              onPrev={prevImage}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const ServiceCard = ({ service, IconComponent, index, isActive, isHovered, onHover, onLeave, onClick, getTimeAgo }) => {
  const cardVariants = {
    initial: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    active: {
      y: -5,
      scale: 1.03,
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      borderColor: "rgba(59, 130, 246, 0.5)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1, rotate: 5 },
    active: { scale: 1.15, rotate: 0 }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      animate={isActive ? "active" : ""}
      onHoverStart={onHover}
      onHoverEnd={onLeave}
      className="relative cursor-pointer group"
      onClick={onClick}
    >
      {/* New Badge for recent services */}
      {(service.createdAt || service.updatedAt) && 
       new Date(service.createdAt || service.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute -top-2 -right-2 z-20"
        >
          
        </motion.div>
      )}

      {/* Gradient Glow Effect */}
      <motion.div
        animate={{
          opacity: isHovered || isActive ? 0.3 : 0,
          scale: isHovered || isActive ? 1.05 : 1,
        }}
        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-lg transition-all duration-300"
      />
      
      <div className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border-2 transition-all duration-300 h-full flex flex-col ${
        isActive 
          ? 'border-blue-500/50 shadow-2xl shadow-blue-500/20' 
          : 'border-gray-200/50 dark:border-gray-700/50 group-hover:border-blue-300/50 shadow-lg hover:shadow-xl'
      }`}>
        <div className="flex items-start space-x-4 mb-4">
          {/* Animated Icon */}
          <motion.div
            variants={iconVariants}
            animate={isActive ? "active" : isHovered ? "hover" : "initial"}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${
              isActive 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-blue-500/25' 
                : 'bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600 group-hover:from-blue-500 group-hover:to-cyan-500'
            }`}
          >
            <IconComponent className="w-6 h-6 text-white" />
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <motion.h3 
              className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2"
              whileHover={{ color: isActive ? "" : "#3B82F6" }}
            >
              {service.title}
            </motion.h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed mb-3">
              {service.description}
            </p>
          </div>
        </div>

        {/* Stats & Features */}
        <div className="mt-auto">
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isActive ? 1 : 0.7,
              height: "auto"
            }}
            className="flex flex-col space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {service.stats}
              </span>
              {(service.createdAt || service.updatedAt) && (
                <div className="flex items-center space-x-1 text-gray-400 dark:text-gray-500 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>{getTimeAgo(service.createdAt || service.updatedAt)}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {service.features?.slice(0, 3).map((feature, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="px-3 py-1 bg-blue-500/10 dark:bg-blue-500/20 rounded-full text-blue-600 dark:text-blue-400 text-xs font-medium"
                >
                  {feature}
                </motion.span>
              ))}
              {service.images && service.images.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 bg-green-500/10 dark:bg-green-500/20 rounded-full text-green-600 dark:text-green-400 text-xs font-medium"
                >
                  {service.images.length} photos
                </motion.span>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const ServiceDetail = ({ service, onImageClick, getIcon, getTimeAgo }) => {
  if (!service) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl text-center"
      >
        <HeartHandshake className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">
          Select a Service
        </h3>
        <p className="text-gray-500 dark:text-gray-500">
          Choose a service from the list to view details
        </p>
      </motion.div>
    );
  }

  const IconComponent = getIcon(service.icon);

  const containerVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.8,
      rotateY: 180 
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 80
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      rotateY: -180,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl overflow-hidden sticky top-8"
    >
      {/* Timestamp */}
      {(service.createdAt || service.updatedAt) && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-end space-x-1 text-gray-500 dark:text-gray-400 text-sm mb-4"
        >
          <Clock className="w-4 h-4" />
          <span>Added {getTimeAgo(service.createdAt || service.updatedAt)}</span>
        </motion.div>
      )}

      {/* Main Image or Image Gallery */}
      {service.images && service.images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative h-48 rounded-2xl overflow-hidden mb-6 group cursor-pointer"
          onClick={() => onImageClick(service.mainImage || service.images[0].url, 0)}
        >
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            src={service.mainImage || service.images[0].url}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
          
          {/* Multiple Images Indicator */}
          {service.images.length > 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm"
            >
              {service.images.length} photos
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg"
          >
            <IconComponent className="w-6 h-6 text-white" />
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-gray-800 dark:text-white"
          >
            {service.title}
          </motion.h3>
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6"
        >
          {service.description}
        </motion.p>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {service.features?.map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center space-x-3 text-gray-700 dark:text-gray-300"
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex-shrink-0"
              />
              <span className="text-sm">{feature}</span>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800"
        >
          <span className="text-gray-600 dark:text-gray-400 font-medium">Impact Scale</span>
          <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">{service.stats}</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const ImageModal = ({ images, currentIndex, onClose, onNext, onPrev }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0, rotateX: 45 }}
      animate={{ scale: 1, opacity: 1, rotateX: 0 }}
      exit={{ scale: 0.8, opacity: 0, rotateX: -45 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="relative max-w-4xl max-h-[90vh] w-full"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2 backdrop-blur-sm"
      >
        <X className="w-6 h-6" />
      </motion.button>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <motion.button
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={onPrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-3 backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.9 }}
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-3 backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </>
      )}

      <motion.img
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        src={images[currentIndex].url}
        alt={`Image ${currentIndex + 1}`}
        className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
      />

      {/* Image Counter */}
      {images.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-sm"
        >
          {currentIndex + 1} / {images.length}
        </motion.div>
      )}

      {/* Image Title */}
      {images[currentIndex].title && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg max-w-md backdrop-blur-sm"
        >
          <p className="text-sm font-medium">{images[currentIndex].title}</p>
        </motion.div>
      )}
    </motion.div>
  </motion.div>
);

export default Services;