import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Users, Heart, Check, Sparkles, Star, Clock } from 'lucide-react';
import axios from 'axios';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    fetchProfileImage();
    simulateLoading();
  }, []);

  const fetchProfileImage = async () => {
    try {
      const response = await axios.get('https://sateesh-kumar-portfolio.onrender.com/api/gallery?category=profile&limit=1');
      if (response.data.length > 0) {
        setProfileImage(response.data[0].image);
      } else {
        setProfileImage('https://res.cloudinary.com/dju35hfu2/image/upload/v1760894251/Portfolio/dgjg2u65elmyqhs7bxfh.jpg');
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
      setProfileImage('https://res.cloudinary.com/dju35hfu2/image/upload/v1760894251/Portfolio/dgjg2u65elmyqhs7bxfh.jpg');
    }
  };

  const simulateLoading = () => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowContent(true);
          setTimeout(() => {
            if (onLoadingComplete && typeof onLoadingComplete === 'function') {
              onLoadingComplete();
            }
          }, 1500);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 200);
  };

  // Stats matching Hero section
  const stats = [
    { number: '20+', text: 'Years of Service', icon: 'Clock' },
    { number: '100+', text: 'Community Camps', icon: 'Users' },
    { number: '5000+', text: 'Lives Impacted', icon: 'Heart' }
  ];

  const StatCard = ({ stat, delay }) => {
    const getIcon = (iconName) => {
      const icons = {
        'Award': Award,
        'Users': Users,
        'Heart': Heart,
        'Star': Star,
        'Clock': Clock
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
          y: -5,
          scale: 1.02,
        }}
        className="group relative bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-amber-300/50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
      >
        <div className="relative z-10 flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
          >
            <IconComponent className="w-5 h-5 text-white" />
          </motion.div>
          
          <div>
            <motion.div className="text-xl font-black text-gray-800 mb-1">
              {stat.number}
            </motion.div>
            <div className="text-gray-600 font-medium text-xs">{stat.text}</div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 z-50 flex items-center justify-center overflow-hidden"
      >
        {/* Fixed Professional Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/dju35hfu2/image/upload/v1760944370/Portfolio/i8srrtgbppm5toptvvxs.jpg')`
          }}
        >
          {/* Dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />
          {/* Gold/Maroon gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-stone-800/40 to-rose-900/30" />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-amber-400/30 rounded-full"
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

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-8 px-4 max-w-4xl mx-auto">
          {/* Profile Image */}
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ 
              duration: 1.2, 
              type: 'spring', 
              stiffness: 100,
              delay: 0.3 
            }}
            className="relative"
          >
            {/* Outer Glow */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -inset-4 bg-gradient-to-r from-amber-500 to-rose-600 rounded-full blur-xl"
            />
            
            {/* Profile Image Container */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/20 bg-white/10 backdrop-blur-md overflow-hidden shadow-2xl">
              <img
                src={profileImage}
                alt="Shri Puttagunta Venkata Sateesh Kumar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://res.cloudinary.com/dju35hfu2/image/upload/v1760894251/Portfolio/dgjg2u65elmyqhs7bxfh.jpg';
                }}
              />
            </div>

            {/* Verification Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1, type: "spring", stiffness: 200 }}
              className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold border-2 border-white shadow-lg"
            >
              <Sparkles className="w-3 h-3 inline mr-1" />
              Leader
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <div className="text-center space-y-6 w-full">
            {/* Name - Matching Hero Section Styling */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-2"
            >
              <h1 className="text-3xl md:text-5xl font-black font-serif leading-tight text-white">
                <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  Puttagunta
                </span>
                <br />
                <span className="text-2xl md:text-4xl font-serif bg-gradient-to-r from-rose-600 to-amber-500 bg-clip-text text-transparent">
                  Venkata Sateesh Kumar
                </span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-lg text-amber-100 font-light italic bg-black/30 backdrop-blur-sm px-4 py-2 rounded-xl border border-amber-400/30"
              >
                "Service Is My Passion"
              </motion.p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              transition={{ delay: 1, duration: 0.8 }}
              className="space-y-3"
            >
              <div className="w-full max-w-md mx-auto h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full relative overflow-hidden"
                >
                  {/* Shimmer Effect */}
                  <motion.div
                    animate={{ x: ['0%', '100%'] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </motion.div>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="text-amber-100 text-sm font-medium"
              >
                Loading Portfolio... {Math.min(100, Math.round(progress))}%
              </motion.p>
            </motion.div>

            {/* Stats - Matching Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto"
            >
              {stats.map((stat, index) => (
                <StatCard 
                  key={stat.text}
                  stat={stat}
                  delay={1.6 + index * 0.15}
                />
              ))}
            </motion.div>
          </div>

          {/* Success Animation */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="text-center space-y-4"
              >
                {/* Checkmark Animation */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                  className="w-14 h-14 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto shadow-2xl border-2 border-white/30"
                >
                  <motion.div
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <Check className="w-7 h-7 text-white" />
                  </motion.div>
                </motion.div>

                {/* Success Text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-2"
                >
                  <p className="text-amber-300 font-semibold text-lg">
                    Portfolio Ready!
                  </p>
                  <p className="text-amber-100 text-sm">
                    Welcome to the official portfolio
                  </p>
                </motion.div>

                {/* Continue Prompt */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-amber-200 text-xs animate-pulse"
                >
                  Entering portfolio...
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-900/50 to-transparent" />
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;