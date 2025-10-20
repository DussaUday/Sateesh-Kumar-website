import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, Sparkles, Award, Briefcase, Users, Building } from 'lucide-react';
import axios from 'axios';

const About = () => {
  const [aboutData, setAboutData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Fixed: Using correct endpoint
      const response = await axios.get('https://sateesh-kumar-portfolio.onrender.com/api/about', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        timeout: 10000
      });
      
      setAboutData(response.data);
    } catch (error) {
      console.error('Error fetching about data:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load about data';
      setError(errorMessage);
      
      // Fallback to default data
      setAboutData({
        bio: `Puttagunta Venkata Sateesh Kumar is a distinguished entrepreneur, philanthropist, and public leader from Andhra Pradesh, India, known for his remarkable contributions to business, social service, politics, and the film industry. As the Chairman of Andhra Hospital, Vijayawada, and the founder of the Puttagunta Venkata Sateesh Health Foundation, he has been instrumental in promoting healthcare access and community welfare through numerous initiatives that uplift the underprivileged. A dedicated member of Lions Club International since the early 2000s, he has spearheaded several impactful projects including the Puttagunta V. Sateesh Kumar Health Club and the construction of a Traffic Police Station, reflecting his deep commitment to public service. In politics, he has been associated with the Telugu Desam Party (TDP) since 1994 and has served on the Vigilance & Monitoring Committee and the Telecom Advisory Board (Government of India), in addition to being appointed as a National Trustee of the Vishwa Hindu Parishad (VHP). A man of many talents, he is also a film producer and actor who believes in using art as a medium for positive influence. His entrepreneurial ventures—Lussomet Skicorp Limited, Tattva Exports & Imports Pvt. Ltd., and Cepoch Software Innovation Pvt. Ltd.—span industries from manufacturing and leather exports to technology innovation, showcasing his visionary leadership and diverse expertise. Guided by integrity, compassion, and a drive to serve, Puttagunta Venkata Sateesh Kumar continues to inspire as a symbol of progress and purpose in both business and society.`,
        image: 'https://res.cloudinary.com/drc8bufjn/image/upload/v1759494949/i2jylorcgognnefbh3vq.jpg',
        title: 'Puttagunta Venkata Sateesh Kumar',
        position: 'National Trustee of VHP, Vishwa Hindu Parishad',
        sectionTitle: 'About Me',
        imageAspectRatio: '3/4',
        badges: [
          {
            title: 'National Trustee: Vishwa Hindu Parishad',
            icon: 'Award',
            position: 'top-right',
            color: 'from-amber-500 to-yellow-600'
          },
          {
            title: 'Since 1994',
            icon: 'Briefcase',
            position: 'bottom-left',
            color: 'from-rose-500 to-maroon-700'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Render badge based on position
  const renderBadge = (badge, index) => {
    if (!badge || !badge.position) return null;

    const positionClasses = {
      'top-right': '-top-4 -right-4',
      'top-left': '-top-4 -left-4',
      'bottom-right': '-bottom-4 -right-4',
      'bottom-left': '-bottom-4 -left-4'
    };

    const iconComponent = {
      Award: <Award className="w-5 h-5" />,
      Briefcase: <Briefcase className="w-5 h-5" />,
      Users: <Users className="w-5 h-5" />,
      Building: <Building className="w-5 h-5" />,
      HeartHandshake: <HeartHandshake className="w-5 h-5" />
    };

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0, rotate: index % 2 === 0 ? -180 : 180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.8 + (index * 0.2), type: "spring" }}
        className={`absolute ${positionClasses[badge.position]} bg-gradient-to-r ${badge.color || 'from-amber-500 to-yellow-600'} text-white px-6 py-3 rounded-2xl shadow-2xl border-2 border-white/80 dark:border-gray-800/80`}
      >
        <div className="flex items-center space-x-2">
          {iconComponent[badge.icon] || <Award className="w-5 h-5" />}
          <span className="font-bold text-sm">{badge.title}</span>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <section id="about" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-stone-100 to-white dark:from-gray-900 dark:via-gray-950 dark:to-black">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-300">Loading about section...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="relative py-20 bg-gradient-to-br from-stone-50 via-stone-100 to-white dark:from-gray-900 dark:via-gray-950 dark:to-black overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-amber-400/30 dark:bg-white/20 rounded-full"
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
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-400/10 to-rose-500/10 rounded-full blur-3xl"
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
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-white/10 to-gray-400/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex flex-col items-center space-y-4 mb-8"
          >
            {/* Decorative Elements */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"></div>
              <HeartHandshake className="w-12 h-12 text-amber-500" />
              <div className="w-12 h-1 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"></div>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black font-serif">
              <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                {aboutData.sectionTitle || 'About Me'}
              </span>
            </h2>
            
            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-serif italic bg-black/30 backdrop-blur-sm px-6 py-3 rounded-xl border border-amber-400/30"
            >
              {aboutData.position || 'National Trustee of VHP, Vishwa Hindu Parishad'}
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Main Content Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Image Section - Full Ratio Display */}
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <div className="relative perspective-1000">
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
                  className="absolute -inset-6 bg-gradient-to-r from-amber-400 via-rose-500 to-maroon-700 rounded-3xl blur-3xl opacity-30"
                />
                
                {/* Main Image Container */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 dark:border-gray-800/80 bg-white dark:bg-gray-800"
                >
                  <img
                    src={aboutData.image || "https://res.cloudinary.com/dju35hfu2/image/upload/v1760894251/Portfolio/dgjg2u65elmyqhs7bxfh.jpg"}
                    alt={`${aboutData.title || 'Puttagunta Venkata Sateesh Kumar'} - ${aboutData.position || 'National Trustee of VHP'}`}
                    className="w-full h-auto object-cover"
                    style={{ aspectRatio: aboutData.imageAspectRatio || '3/4' }}
                    onError={(e) => {
                      console.error('Error loading about image:', aboutData.image);
                      e.target.src = "https://res.cloudinary.com/dju35hfu2/image/upload/v1760894251/Portfolio/dgjg2u65elmyqhs7bxfh.jpg";
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </motion.div>

                {/* Dynamic Badges */}
                {aboutData.badges && aboutData.badges.map((badge, index) => 
                  renderBadge(badge, index)
                )}

                {/* Default Badges if none provided */}
                {(!aboutData.badges || aboutData.badges.length === 0) && (
                  <>
                    {/* VHP Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: 0.8, type: "spring" }}
                      className="absolute -top-4 -right-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-3 rounded-2xl shadow-2xl border-2 border-white/80 dark:border-gray-800/80"
                    >
                      <div className="flex items-center space-x-2">
                        <Award className="w-5 h-5" />
                        <span className="font-bold text-sm">National Trustee: Vishwa Hindu Parishad</span>
                      </div>
                    </motion.div>

                    {/* Experience Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0, rotate: 180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: 1, type: "spring" }}
                      className="absolute -bottom-4 -left-4 bg-gradient-to-r from-rose-500 to-maroon-700 text-white px-6 py-3 rounded-2xl shadow-2xl border-2 border-white/80 dark:border-gray-800/80"
                    >
                      <div className="flex items-center space-x-2">
                        <Briefcase className="w-5 h-5" />
                        <span className="font-bold text-sm">Since 1994</span>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Content Section */}
            <motion.div
              variants={itemVariants}
              className="space-y-8"
            >
              {/* Name Title */}
              <div className="space-y-4">
                <motion.h3
                  variants={itemVariants}
                  className="text-4xl md:text-5xl lg:text-6xl font-black font-serif text-gray-800 dark:text-white leading-tight"
                >
                  <span className="text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-rose-600 to-amber-500 bg-clip-text text-transparent">
                    {aboutData.title || 'Puttagunta Venkata Sateesh Kumar'}
                  </span>
                </motion.h3>
              </div>

              {/* Professional Highlights - Single Paragraph */}
              <motion.div
                variants={itemVariants}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-amber-200 dark:border-amber-800 shadow-xl"
              >
                <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  {aboutData.bio ? (
                    <div className="whitespace-pre-line">{aboutData.bio}</div>
                  ) : (
                    <p>
                      Puttagunta Venkata Sateesh Kumar is a distinguished entrepreneur, philanthropist, and public leader from Andhra Pradesh, India, known for his remarkable contributions to business, social service, politics, and the film industry. As the Chairman of Andhra Hospital, Vijayawada, and the founder of the Puttagunta Venkata Sateesh Health Foundation, he has been instrumental in promoting healthcare access and community welfare through numerous initiatives that uplift the underprivileged. A dedicated member of Lions Club International since the early 2000s, he has spearheaded several impactful projects including the Puttagunta V. Sateesh Kumar Health Club and the construction of a Traffic Police Station, reflecting his deep commitment to public service. In politics, he has been associated with the Telugu Desam Party (TDP) since 1994 and has served on the Vigilance & Monitoring Committee and the Telecom Advisory Board (Government of India), in addition to being appointed as a National Trustee of the Vishwa Hindu Parishad (VHP). A man of many talents, he is also a film producer and actor who believes in using art as a medium for positive influence. His entrepreneurial ventures—Lussomet Skicorp Limited, Tattva Exports & Imports Pvt. Ltd., and Cepoch Software Innovation Pvt. Ltd.—span industries from manufacturing and leather exports to technology innovation, showcasing his visionary leadership and diverse expertise. Guided by integrity, compassion, and a drive to serve, Puttagunta Venkata Sateesh Kumar continues to inspire as a symbol of progress and purpose in both business and society.
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;