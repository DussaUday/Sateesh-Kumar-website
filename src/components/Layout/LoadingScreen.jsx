import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Users, Heart, Check } from 'lucide-react';
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
        // Use a single placeholder image
        setProfileImage('https://scontent.fhyd14-4.fna.fbcdn.net/v/t39.30808-6/308503258_457664199720909_8604279637100674190_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=d1afvFy1qIkQ7kNvwHjsxul&_nc_oc=Adl-z75kxq6jSYH0LlOybcgBWTAXHbTpzQG3fJxfkuCCygj4w8sw3hVGq-FLE-tQYX3nOPvJmq5XpY9VYS9apd-N&_nc_zt=23&_nc_ht=scontent.fhyd14-4.fna&_nc_gid=0bUTIjMOeiahuYdr7GqFSA&oh=00_AfZX1K-3vjOYWcFs2PVhE6is38KRFTukzagJ22zsEEOtnA&oe=68E410AD');
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
      // Fallback image
      setProfileImage('https://scontent.fhyd14-4.fna.fbcdn.net/v/t39.30808-6/308503258_457664199720909_8604279637100674190_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=d1afvFy1qIkQ7kNvwHjsxul&_nc_oc=Adl-z75kxq6jSYH0LlOybcgBWTAXHbTpzQG3fJxfkuCCygj4w8sw3hVGq-FLE-tQYX3nOPvJmq5XpY9VYS9apd-N&_nc_zt=23&_nc_ht=scontent.fhyd14-4.fna&_nc_gid=0bUTIjMOeiahuYdr7GqFSA&oh=00_AfZX1K-3vjOYWcFs2PVhE6is38KRFTukzagJ22zsEEOtnA&oe=68E410AD');
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
          }, 2000);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="fixed inset-0 bg-gradient-to-br from-orange-900 via-white to-green-900 z-50 flex items-center justify-center"
      >
        <div className="relative w-full h-full">
          {/* Animated Patriotic Background */}
          <div className="absolute inset-0 opacity-30">
            <motion.div
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="w-full h-full bg-gradient-to-r from-orange-500 via-white to-green-500 bg-[length:200%_100%]"
            />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-12">
            {/* Single Profile Image */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, type: 'spring', stiffness: 80 }}
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <div className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-orange-400/30 to-green-600/30 border-4 border-white/40 backdrop-blur-md overflow-hidden shadow-2xl">
                <img
                  src={profileImage || 'https://scontent.fhyd14-4.fna.fbcdn.net/v/t39.30808-6/308503258_457664199720909_8604279637100674190_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=d1afvFy1qIkQ7kNvwHjsxul&_nc_oc=Adl-z75kxq6jSYH0LlOybcgBWTAXHbTpzQG3fJxfkuCCygj4w8sw3hVGq-FLE-tQYX3nOPvJmq5XpY9VYS9apd-N&_nc_zt=23&_nc_ht=scontent.fhyd14-4.fna&_nc_gid=0bUTIjMOeiahuYdr7GqFSA&oh=00_AfZX1K-3vjOYWcFs2PVhE6is38KRFTukzagJ22zsEEOtnA&oe=68E410AD'}
                  alt="Puttagunta
Venkata Sateesh Kumar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://scontent.fhyd14-4.fna.fbcdn.net/v/t39.30808-6/308503258_457664199720909_8604279637100674190_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=d1afvFy1qIkQ7kNvwHjsxul&_nc_oc=Adl-z75kxq6jSYH0LlOybcgBWTAXHbTpzQG3fJxfkuCCygj4w8sw3hVGq-FLE-tQYX3nOPvJmq5XpY9VYS9apd-N&_nc_zt=23&_nc_ht=scontent.fhyd14-4.fna&_nc_gid=0bUTIjMOeiahuYdr7GqFSA&oh=00_AfZX1K-3vjOYWcFs2PVhE6is38KRFTukzagJ22zsEEOtnA&oe=68E410AD';
                  }}
                />
              </div>
              
              {/* Unique Pulsing Glow Animation */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-green-500 rounded-full blur-xl"
              />
            </motion.div>

            {/* Loading Progress */}
            <div className="text-center space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="space-y-4"
              >
                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  Puttagunta
{' '}
                  <span className="bg-gradient-to-r from-orange-400 via-white to-green-500 bg-clip-text text-transparent">
                    Venkata Sateesh Kumar
                  </span>
                </h1>
                <p className="text-xl text-white/80 font-serif">
                  Champion of the People
                </p>
              </motion.div>

              {/* Progress Bar with Patriotic Gradient */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '300px' }}
                transition={{ delay: 0.5, duration: 1 }}
                className="w-72 md:w-96 h-3 bg-white/20 rounded-full overflow-hidden mx-auto"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-orange-500 via-white to-green-500 rounded-full relative"
                >
                  <motion.div
                    animate={{ x: ['0%', '100%'] }}
                    transition={{ 
                      duration: 1, 
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  />
                </motion.div>
              </motion.div>

              {/* Stats with Enhanced Styling */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="flex justify-center space-x-8 text-white/80"
              >
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
                  <Award className="w-5 h-5 text-orange-400" />
                  <span className="text-sm font-medium">20+ Years of Service</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
                  <Users className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium">100+ Community Camps</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
                  <Heart className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">5000+ Lives Transformed</span>
                </div>
              </motion.div>
            </div>

            {/* Success Message with Confetti-like Animation */}
            <AnimatePresence>
              {showContent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  className="text-center space-y-4"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg"
                  >
                    <Check className="w-8 h-8 text-white" />
                  </motion.div>
                  <p className="text-green-300 font-semibold text-lg">
                    Portfolio Loaded Successfully!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;