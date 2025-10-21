import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Play, Pause, Image as ImageIcon, 
  Award, Settings, Users, Star, Sparkles, Clock, Heart, Target,
  Search, Filter, ArrowDown, ArrowUp, X, BookOpen, Droplets,
  HeartHandshake, Globe, Shield, Calendar, Book, ArrowRight,
  Grid, List, Eye
} from 'lucide-react';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [displayedServices, setDisplayedServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [showAll, setShowAll] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(8);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchServices();
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Parallax effect for background
  const parallaxX = mousePosition.x * 0.01;
  const parallaxY = mousePosition.y * 0.01;

  useEffect(() => {
    filterAndSortServices();
  }, [services, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    // Update displayed services based on showAll state
    if (showAll) {
      setDisplayedServices(filteredServices);
    } else {
      setDisplayedServices(filteredServices.slice(0, itemsToShow));
    }
  }, [filteredServices, showAll, itemsToShow]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://sateesh-kumar-portfolio.onrender.com/api/services');
      const sortedServices = response.data.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || new Date());
        const dateB = new Date(b.createdAt || b.updatedAt || new Date());
        return dateB - dateA;
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
    setShowAll(false); // Reset showAll when filtering
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
    if (selectedService?.images) {
      setCurrentImageIndex((prev) => 
        (prev + 1) % selectedService.images.length
      );
    }
  };

  const prevImage = () => {
    if (selectedService?.images) {
      setCurrentImageIndex((prev) => 
        (prev - 1 + selectedService.images.length) % selectedService.images.length
      );
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder(field === 'date' ? 'desc' : 'asc');
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const loadMore = () => {
    setItemsToShow(prev => prev + 8);
  };

  if (loading) {
    return (
      <section id="services" className="relative py-16 bg-gradient-to-br from-stone-50 via-stone-100 to-white dark:from-gray-900 dark:via-gray-950 dark:to-black overflow-hidden min-h-[60vh] flex items-center justify-center">
        {/* Background with parallax */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ 
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
          <p className="text-gray-600 dark:text-gray-300 font-serif text-lg">Loading services...</p>
        </motion.div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section id="services" className="relative py-16 bg-gradient-to-br from-stone-50 via-stone-100 to-white dark:from-gray-900 dark:via-gray-950 dark:to-black overflow-hidden min-h-[60vh] flex items-center justify-center">
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
    <section id="services" className="relative py-16 bg-gradient-to-br from-stone-50 via-stone-100 to-white dark:from-gray-900 dark:via-gray-950 dark:to-black overflow-hidden">
      
      {/* Background with parallax */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ 
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
        {/* Header */}
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
              Service Is My Passion
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-serif italic bg-black/30 backdrop-blur-sm px-6 py-3 rounded-xl border border-amber-400/30"
          >
            "Dedicated to making a difference through compassionate service and community development"
          </motion.p>

          {/* Search and Filter Bar */}
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
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-amber-200/50 dark:border-amber-700/30 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
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
                  <span>Grid</span>
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
                  <span>List</span>
                </motion.button>
              </div>

              {/* Sort Buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSort('name')}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-2xl transition-all duration-300 ${
                    sortBy === 'name' 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/25' 
                      : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 border border-amber-200/50 dark:border-amber-700/30'
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
                      ? 'bg-gradient-to-r from-rose-500 to-maroon-700 text-white shadow-lg shadow-rose-500/25' 
                      : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 border border-rose-200/50 dark:border-rose-700/30'
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
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Services Content */}
        <div className="max-w-7xl mx-auto">
          {viewMode === 'grid' ? (
            <ServicesGridView 
              services={displayedServices}
              selectedService={selectedService}
              onServiceSelect={setSelectedService}
              getIcon={getIcon}
              getTimeAgo={getTimeAgo}
            />
          ) : (
            <ServicesListView 
              services={displayedServices}
              selectedService={selectedService}
              onServiceSelect={setSelectedService}
              getIcon={getIcon}
              getTimeAgo={getTimeAgo}
            />
          )}

          {/* View More/Less Buttons */}
          {filteredServices.length > 8 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mt-12"
            >
              {!showAll && displayedServices.length < filteredServices.length ? (
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleShowAll}
                    className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-400"
                  >
                    <Eye className="w-5 h-5" />
                    <span className="font-semibold">
                      View All {filteredServices.length} Services
                    </span>
                    <motion.div
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowDown className="w-5 h-5" />
                    </motion.div>
                  </motion.button>

                  {filteredServices.length > itemsToShow && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={loadMore}
                      className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 rounded-xl border border-amber-200/50 dark:border-amber-700/30 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300"
                    >
                      Load 8 More
                    </motion.button>
                  )}
                </div>
              ) : (
                showAll && (
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleShowAll}
                    className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-rose-500 to-maroon-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-rose-400"
                  >
                    <span className="font-semibold">
                      Show Less
                    </span>
                    <motion.div
                      animate={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowDown className="w-5 h-5" />
                    </motion.div>
                  </motion.button>
                )
              )}
            </motion.div>
          )}

          {/* No Results Message */}
          {filteredServices.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Search className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                No services found
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Try adjusting your search terms or filters
              </p>
            </motion.div>
          )}
        </div>

        {/* Service Detail Modal */}
        <AnimatePresence>
          {selectedService && (
            <ServiceDetailModal
              service={selectedService}
              currentImageIndex={currentImageIndex}
              isPlaying={isPlaying}
              onClose={() => {
                setSelectedService(null);
                setCurrentImageIndex(0);
                setIsPlaying(false);
              }}
              onNextImage={nextImage}
              onPrevImage={prevImage}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              getIcon={getIcon}
              getTimeAgo={getTimeAgo}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const ServicesGridView = ({ services, selectedService, onServiceSelect, getIcon, getTimeAgo }) => {
  return (
    <motion.div 
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <AnimatePresence>
        {services.map((service, index) => (
          <ServiceGridCard
            key={service._id}
            service={service}
            index={index}
            isSelected={selectedService?._id === service._id}
            onSelect={onServiceSelect}
            getIcon={getIcon}
            getTimeAgo={getTimeAgo}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

const ServicesListView = ({ services, selectedService, onServiceSelect, getIcon, getTimeAgo }) => {
  return (
    <motion.div layout className="space-y-4">
      <AnimatePresence>
        {services.map((service, index) => (
          <ServiceListCard
            key={service._id}
            service={service}
            index={index}
            isSelected={selectedService?._id === service._id}
            onSelect={onServiceSelect}
            getIcon={getIcon}
            getTimeAgo={getTimeAgo}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

const ServiceGridCard = ({ service, index, isSelected, onSelect, getIcon, getTimeAgo }) => {
  const IconComponent = getIcon(service.icon);
  const hasImage = service.mainImage || (service.images && service.images.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
        isSelected 
          ? 'border-amber-500 shadow-2xl shadow-amber-500/20' 
          : 'border-amber-200/50 dark:border-amber-700/50 hover:border-amber-300/50 shadow-lg hover:shadow-xl'
      }`}
      onClick={() => onSelect(service)}
    >
      {/* Image Section */}
      {hasImage && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={service.mainImage || service.images[0].url}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Image Count Badge */}
          {service.images && service.images.length > 1 && (
            <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
              {service.images.length} photos
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
          >
            <IconComponent className="w-6 h-6 text-white" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-2 font-serif">
              {service.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mt-1">
              {service.description}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-3">
          {service.features?.slice(0, 2).map((feature, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="px-2 py-1 bg-amber-500/10 dark:bg-amber-500/20 rounded-full text-amber-600 dark:text-amber-400 text-xs font-medium"
            >
              {feature}
            </motion.span>
          ))}
          {service.features && service.features.length > 2 && (
            <span className="px-2 py-1 bg-gray-500/10 dark:bg-gray-500/20 rounded-full text-gray-600 dark:text-gray-400 text-xs">
              +{service.features.length - 2} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-amber-200/50 dark:border-amber-700/50">
          <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">
            {service.stats}
          </span>
          {(service.createdAt || service.updatedAt) && (
            <div className="flex items-center space-x-1 text-gray-400 dark:text-gray-500 text-xs">
              <Clock className="w-3 h-3" />
              <span>{getTimeAgo(service.createdAt || service.updatedAt)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-yellow-600/10 rounded-3xl pointer-events-none"
      />

      {/* New Badge */}
      {(service.createdAt || service.updatedAt) && 
        new Date(service.createdAt || service.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-rose-500 to-maroon-700 text-white text-xs font-bold rounded-full shadow-lg"
        >
          NEW
        </motion.div>
      )}
    </motion.div>
  );
};

const ServiceListCard = ({ service, index, isSelected, onSelect, getIcon, getTimeAgo }) => {
  const IconComponent = getIcon(service.icon);
  const hasImage = service.mainImage || (service.images && service.images.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ x: 5 }}
      className={`relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl cursor-pointer border-2 transition-all duration-300 ${
        isSelected 
          ? 'border-amber-500 shadow-lg shadow-amber-500/20' 
          : 'border-amber-200/50 dark:border-amber-700/50 hover:border-amber-300/50'
      }`}
      onClick={() => onSelect(service)}
    >
      <div className="flex items-center p-4">
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-14 h-14 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 mr-4"
        >
          <IconComponent className="w-6 h-6 text-white" />
        </motion.div>

        {/* Image Thumbnail */}
        {hasImage && (
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 mr-4 border border-amber-200/50">
            <img
              src={service.mainImage || service.images[0].url}
              alt={service.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white font-serif line-clamp-1">
                {service.title}
              </h3>
              {/* New Badge for List View */}
              {(service.createdAt || service.updatedAt) && 
                new Date(service.createdAt || service.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                <span className="px-2 py-1 bg-gradient-to-r from-rose-500 to-maroon-700 text-white text-xs font-bold rounded-full">
                  NEW
                </span>
              )}
            </div>
            {(service.createdAt || service.updatedAt) && (
              <div className="flex items-center space-x-1 text-gray-400 dark:text-gray-500 text-xs flex-shrink-0 ml-2">
                <Clock className="w-3 h-3" />
                <span>{getTimeAgo(service.createdAt || service.updatedAt)}</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-2">
            {service.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {service.features?.slice(0, 3).map((feature, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-amber-500/10 dark:bg-amber-500/20 rounded-full text-amber-600 dark:text-amber-400 text-xs"
                >
                  {feature}
                </span>
              ))}
            </div>
            <span className="text-amber-600 dark:text-amber-400 font-bold text-sm flex-shrink-0 ml-2">
              {service.stats}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <motion.div
          initial={{ x: 0 }}
          whileHover={{ x: 5 }}
          className="ml-4 text-amber-500"
        >
          <ArrowRight className="w-5 h-5" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const ServiceDetailModal = ({ 
  service, 
  currentImageIndex, 
  isPlaying, 
  onClose, 
  onNextImage, 
  onPrevImage, 
  onTogglePlay,
  getIcon,
  getTimeAgo 
}) => {
  const IconComponent = getIcon(service.icon);
  const hasImages = service.images && service.images.length > 0;
  const currentImage = hasImages ? service.images[currentImageIndex] : null;

  // Auto-play effect
  React.useEffect(() => {
    let interval;
    if (isPlaying && hasImages && service.images.length > 1) {
      interval = setInterval(() => {
        onNextImage();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, hasImages, service.images?.length, onNextImage]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotateX: 45 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.8, opacity: 0, rotateX: -45 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="relative max-w-6xl w-full max-h-[90vh] overflow-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full backdrop-blur-sm border border-amber-300/30"
        >
          <X className="w-6 h-6" />
        </motion.button>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Image Section */}
          <div className="lg:w-1/2 relative">
            {hasImages ? (
              <>
                <div className="relative h-64 lg:h-full bg-gray-200 dark:bg-gray-700">
                  <img
                    src={currentImage.url}
                    alt={currentImage.title || service.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Navigation Arrows */}
                  {service.images.length > 1 && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1, x: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onPrevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full backdrop-blur-sm border border-amber-300/30"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, x: 2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onNextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full backdrop-blur-sm border border-amber-300/30"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </>
                  )}
                  
                  {/* Play/Pause Button */}
                  {service.images.length > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onTogglePlay}
                      className="absolute bottom-4 left-4 p-3 bg-black/50 text-white rounded-full backdrop-blur-sm border border-amber-300/30"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </motion.button>
                  )}
                  
                  {/* Image Counter */}
                  {service.images.length > 1 && (
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 text-white rounded-full backdrop-blur-sm text-sm border border-amber-300/30">
                      {currentImageIndex + 1} / {service.images.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {service.images.length > 1 && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex space-x-2 overflow-x-auto">
                      {service.images.map((image, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {/* You would need to add state for this */}}
                          className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 ${
                            index === currentImageIndex 
                              ? 'border-amber-500' 
                              : 'border-transparent'
                          }`}
                        >
                          <img
                            src={image.url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="h-64 lg:h-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center">
                <IconComponent className="w-24 h-24 text-white opacity-80" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2 p-6 lg:p-8 overflow-y-auto">
            <div className="flex items-center space-x-3 mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-14 h-14 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <IconComponent className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white font-serif"
                >
                  {service.title}
                </motion.h2>
                {(service.createdAt || service.updatedAt) && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-500 dark:text-gray-400 text-sm flex items-center space-x-1 mt-1"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Added {getTimeAgo(service.createdAt || service.updatedAt)}</span>
                  </motion.p>
                )}
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6"
            >
              {service.description}
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-6"
            >
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 font-serif">
                Key Features
              </h3>
              <div className="space-y-2">
                {service.features?.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center space-x-3 text-gray-700 dark:text-gray-300"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-2 h-2 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex-shrink-0"
                    />
                    <span className="text-sm lg:text-base">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Impact Scale</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold text-lg">{service.stats}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Services;