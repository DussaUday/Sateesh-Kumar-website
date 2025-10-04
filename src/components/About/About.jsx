import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Heart, Award, Clock, MapPin, Droplets, BookOpen, HeartHandshake } from 'lucide-react';
import axios from 'axios';

const About = () => {
  const [aboutSections, setAboutSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutSections();
  }, []);

  const fetchAboutSections = async () => {
    try {
      const response = await axios.get('https://sateesh-kumar-portfolio.onrender.com/api/about/sections');
      setAboutSections(response.data);
    } catch (error) {
      console.error('Error fetching about sections:', error);
      // Set the specific content you provided
      setAboutSections([
        {
          _id: '1',
          title: 'About Me',
          content: `I am Puttagunta Venkata Sateesh Kumar, Chairman of Global Service Trust, a charity organization dedicated to uplifting lives through service and compassion. Over the years, I have led several impactful initiatives, including the supply of safe drinking water to villages every single day, benefitting thousands of people with consistent access to clean water.

Through the Trust, we also support education by distributing scholarships worth ₹5 lakhs annually, along with notebooks and textbooks to underprivileged students. Our mission extends to caring for health and differently-abled individuals, ensuring that every section of society receives attention and support.

My journey in service began with Lionism in 2004, where I have had the honor of serving in many leadership roles such as Club President, District Cabinet Secretary, District Coordinator, LCIF Chairman, Government Area Representative, and Zone Chairperson. I also take pride in being the only Lion member in the district and state to initiate and successfully complete permanent projects.

Some of these milestones include the Puttagunta V. Sateesh Kumar Health Club, inaugurated by International President Lion Amarasurya in 2006–07, and the Traffic Police Station Building, inaugurated by International President Lion Barry Palmer in 2012–13.

Service to humanity has always been at the core of my life. With the support of Global Service Trust, I continue to work towards creating meaningful change, touching lives through compassion, education, health, and community development.`,
          image: 'https://res.cloudinary.com/drc8bufjn/image/upload/v1759494949/i2jylorcgognnefbh3vq.jpg',
          order: 1
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: Clock, number: '20+', text: 'Years of Service' },
    { icon: Droplets, number: 'Daily', text: 'Water Supply' },
    { icon: BookOpen, number: '₹5L', text: 'Annual Scholarships' },
    { icon: HeartHandshake, number: 'Global', text: 'Service Trust' },
    { icon: Award, number: 'Permanent', text: 'Projects' },
    { icon: Users, number: 'Thousands', text: 'Lives Impacted' }
  ];

  const keyInitiatives = [
    {
      icon: Droplets,
      title: 'Daily Water Supply',
      description: 'Providing safe drinking water to villages every single day'
    },
    {
      icon: BookOpen,
      title: 'Education Support',
      description: '₹5 lakhs annual scholarships + notebooks & textbooks'
    },
    {
      icon: Heart,
      title: 'Healthcare Initiatives',
      description: 'Caring for health and differently-abled individuals'
    },
    {
      icon: Target,
      title: 'Permanent Projects',
      description: 'Health Club & Traffic Police Station Building'
    }
  ];

  const leadershipRoles = [
    "Club President",
    "District Cabinet Secretary",
    "District Coordinator",
    "LCIF Chairman",
    "Government Area Representative",
    "Zone Chairperson"
  ];

  if (loading) {
    return (
      <section id="about" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
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
            <HeartHandshake className="w-12 h-12 text-blue-500" />
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent">
              About Me
            </h2>
            <HeartHandshake className="w-12 h-12 text-blue-500" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Chairman, Global Service Trust - Dedicated to Uplifting Lives Through Service
          </motion.p>
        </motion.div>

        {/* Main Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Image Section - Full Ratio Display */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://res.cloudinary.com/drc8bufjn/image/upload/v1759494949/i2jylorcgognnefbh3vq.jpg"
                  alt="Puttagunta Venkata Sateesh Kumar - Chairman, Global Service Trust"
                  className="w-full h-auto object-contain max-h-[600px]"
                  style={{ aspectRatio: '3/4' }} // Maintain original image ratio
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>

              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-2xl shadow-lg"
              >
                <span className="font-bold text-sm">Global Service Trust</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-2xl shadow-lg"
              >
                <span className="font-bold text-sm">Since 2004</span>
              </motion.div>
            </motion.div>

            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <h3 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
                Puttagunta Venkata <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Sateesh Kumar</span>
              </h3>

              <div className="inline-flex items-center space-x-2 bg-blue-500/10 dark:bg-blue-500/20 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-700">
                <HeartHandshake className="w-5 h-5 text-blue-500" />
                <span className="text-blue-700 dark:text-blue-300 font-semibold">Chairman, Global Service Trust</span>
              </div>

              {/* Main Content */}
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  I am Puttagunta Venkata Sateesh Kumar, Chairman of Global Service Trust, a charity organization dedicated to uplifting lives through service and compassion. Over the years, I have led several impactful initiatives, including the supply of safe drinking water to villages every single day, benefitting thousands of people with consistent access to clean water.
                </p>

                <p>
                  Through the Trust, we also support education by distributing scholarships worth ₹5 lakhs annually, along with notebooks and textbooks to underprivileged students. Our mission extends to caring for health and differently-abled individuals, ensuring that every section of society receives attention and support.
                </p>

                <p>
                  My journey in service began with Lionism in 2004, where I have had the honor of serving in many leadership roles such as Club President, District Cabinet Secretary, District Coordinator, LCIF Chairman, Government Area Representative, and Zone Chairperson. I also take pride in being the only Lion member in the district and state to initiate and successfully complete permanent projects.
                </p>

                <p>
                  Some of these milestones include the Puttagunta V. Sateesh Kumar Health Club, inaugurated by International President Lion Amarasurya in 2006–07, and the Traffic Police Station Building, inaugurated by International President Lion Barry Palmer in 2012–13.
                </p>

                <p>
                  Service to humanity has always been at the core of my life. With the support of Global Service Trust, I continue to work towards creating meaningful change, touching lives through compassion, education, health, and community development.
                </p>
              </div>

              {/* Leadership Roles */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
                  <Award className="w-6 h-6 text-blue-500" />
                  <span>Leadership Roles in Lionism</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {leadershipRoles.map((role, index) => (
                    <motion.div
                      key={role}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-700"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{role}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Key Initiatives */}


        {/* International Projects */}


      </div>
    </section>
  );
};

export default About;