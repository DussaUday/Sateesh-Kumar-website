import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowDown, Award, Users, Heart, Sparkles, Star, TrendingUp, MapPin, Calendar, Shield, Target } from 'lucide-react';
import axios from 'axios';

const Hero = () => {
  const { t } = useTranslation();
  const [heroData, setHeroData] = useState(null);
  const [currentText, setCurrentText] = useState(0);
  const [profileImage, setProfileImage] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    fetchHeroData();
    fetchProfileImage();
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await axios.get('/api/hero');
      setHeroData(response.data);
    } catch (error) {
      console.error('Error fetching hero data:', error);
      setHeroData({
        title: "Puttagunta Venkata Sateesh Kumar",
        subtitle: "Service Is My Passion",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        stats: [
          { number: '20+', text: 'Years of Service', icon: 'Award' },
          { number: '100+', text: 'Community Camps', icon: 'Users' },
          { number: '5000+', text: 'Lives Impacted', icon: 'Heart' }
        ]
      });
    }
  };

  const fetchProfileImage = async () => {
    try {
      const response = await axios.get('/api/gallery?category=profile&limit=1');
      if (response.data.length > 0) {
        setProfileImage(response.data[0].image);
      } else {
        setProfileImage('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80');
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  const texts = [
    heroData?.subtitle || "Service Is My Passion",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [texts.length]);

  // Parallax effect for background
  const parallaxX = mousePosition.x * 0.01;
  const parallaxY = mousePosition.y * 0.01;

  if (!heroData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-emerald-900 dark:to-blue-900 pt-20">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center"
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>
      </div>
    );
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-emerald-900 dark:to-blue-900 pt-20 lg:pt-0">
      
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroData.image})`,
          transform: `translateX(${parallaxX}px) translateY(${parallaxY}px)`
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/30 dark:bg-cyan-400/20 rounded-full"
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
        
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Mobile: Profile Image First */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="lg:hidden relative flex justify-center order-1"
          >
            <MobileProfileImage profileImage={profileImage} />
          </motion.div>

          {/* Left Content - Text & Stats */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="space-y-8 text-gray-800 dark:text-white order-2 lg:order-1"
          >
            

            {/* Main Title */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight"
              >
                
                
                <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 dark:from-amber-300 dark:via-orange-300 dark:to-red-300 bg-clip-text text-transparent">
                  Puttagunta
                </span>
                <br />
                <span className="text-2xl md:text-4xl lg:text-5xl bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Venkata Sateesh Kumar
                </span>
              </motion.h1>

              {/* Animated Subtitle */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="h-16 flex items-center"
              >
                <AnimatedText texts={texts} currentText={currentText} />
              </motion.div>
            </div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {heroData.stats.map((stat, index) => (
                <StatCard 
                  key={stat.text}
                  stat={stat}
                  delay={1.2 + index * 0.15}
                />
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-2xl font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 flex items-center space-x-2"
                onClick={() => (window.location.href = '#gallery')}
              >
                <Sparkles className="w-5 h-5" />
                <span>Explore Journey</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 md:px-8 md:py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => (window.location.href = '#awards')}
              >
                View Achievements
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Desktop: Profile Image - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            className="hidden lg:flex relative justify-center lg:justify-end order-1 lg:order-2"
          >
            <DesktopProfileImage profileImage={profileImage} />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center space-y-3"
          >
            <span className="text-white text-sm font-medium backdrop-blur-sm bg-black/30 px-3 py-1 rounded-full">Scroll to Explore</span>
            <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-white/80 rounded-full mt-2"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Mobile Profile Image Component
const MobileProfileImage = ({ profileImage }) => {
  return (
    <div className="relative">
      {/* Background Glow */}
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
        className="absolute -inset-6 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 rounded-full blur-2xl opacity-30"
      />
      
      {/* Profile Image */}
      <motion.div
        whileHover={{ scale: 1.02, rotate: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <motion.img
          src={profileImage}
          alt="Shri Puttagunta Venkata Sateesh Kumar"
          className="w-64 h-64 rounded-3xl object-cover border-6 border-white/80 dark:border-gray-800/80 shadow-2xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
        />
        
        {/* Verification Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1.8, type: "spring" }}
          className="absolute -top-3 -right-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full p-2 shadow-2xl border-3 border-white dark:border-gray-900"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </motion.div>

        {/* Experience Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-gray-800 dark:text-white text-sm">20+ Years</span>
            <span className="text-gray-600 dark:text-gray-400 text-sm">Experience</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Desktop Profile Image Component
const DesktopProfileImage = ({ profileImage }) => {
  return (
    <div className="relative">
      {/* Background Glow */}
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
        className="absolute -inset-8 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 rounded-full blur-3xl opacity-30"
      />
      
      {/* Profile Image */}
      <motion.div
        whileHover={{ scale: 1.02, rotate: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <motion.img
          src={profileImage}
          alt="Shri Puttagunta Venkata Sateesh Kumar"
          className="w-80 h-80 lg:w-96 lg:h-96 xl:w-[480px] xl:h-[480px] rounded-3xl object-cover border-8 border-white/80 dark:border-gray-800/80 shadow-2xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
        />
        
        {/* Floating Elements */}
        <FloatingElement
          icon={<Award className="w-6 h-6" />}
          position="top"
          delay={1}
          color="from-amber-400 to-orange-400"
        />
        <FloatingElement
          icon={<Users className="w-6 h-6" />}
          position="right"
          delay={1.2}
          color="from-emerald-400 to-cyan-400"
        />
        <FloatingElement
          icon={<Heart className="w-6 h-6" />}
          position="bottom"
          delay={1.4}
          color="from-rose-400 to-pink-400"
        />
        <FloatingElement
          icon={<Target className="w-6 h-6" />}
          position="left"
          delay={1.6}
          color="from-purple-400 to-indigo-400"
        />

        {/* Verification Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1.8, type: "spring" }}
          className="absolute -top-4 -right-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full p-3 shadow-2xl border-4 border-white dark:border-gray-900"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>

        {/* Experience Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-gray-800 dark:text-white">20+ Years</span>
            <span className="text-gray-600 dark:text-gray-400">Experience</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const AnimatedText = ({ texts, currentText }) => {
  return (
    <motion.div
      key={currentText}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-xl md:text-2xl font-light text-white italic bg-black/30 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/20"
    >
      "{texts[currentText]}"
    </motion.div>
  );
};

const StatCard = ({ stat, delay }) => {
  const getIcon = (iconName) => {
    const icons = {
      'Award': Award,
      'Users': Users,
      'Heart': Heart,
      'Star': Star,
      'Shield': Shield
    };
    return icons[iconName] || Award;
  };

  const IconComponent = getIcon(stat.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, type: "spring" }}
      whileHover={{ 
        y: -8,
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-4 md:p-5 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Hover Effect Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      
      <div className="relative z-10 flex items-center space-x-3 md:space-x-4">
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:shadow-emerald-500/25 transition-all duration-300"
        >
          <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-white" />
        </motion.div>
        
        <div>
          <motion.div 
            className="text-xl md:text-2xl font-black text-gray-800 dark:text-white mb-1"
            whileHover={{ scale: 1.1 }}
          >
            {stat.number}
          </motion.div>
          <div className="text-gray-600 dark:text-gray-400 font-medium text-xs md:text-sm">{stat.text}</div>
        </div>
      </div>
    </motion.div>
  );
};

const FloatingElement = ({ icon, position, delay, color }) => {
  const positions = {
    top: { top: '-20%', left: '50%', x: '-50%' },
    right: { top: '50%', right: '-20%', y: '-50%' },
    bottom: { bottom: '-20%', left: '50%', x: '-50%' },
    left: { top: '50%', left: '-20%', y: '-50%' }
  };

  const pos = positions[position];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, ...pos }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: position === 'top' || position === 'bottom' ? [0, -10, 0] : 0,
        x: position === 'left' || position === 'right' ? [0, -10, 0] : 0
      }}
      transition={{ 
        delay,
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`absolute w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/80 dark:border-gray-800/80`}
      style={pos}
    >
      <div className="text-white">
        {icon}
      </div>
    </motion.div>
  );
};

export default Hero;