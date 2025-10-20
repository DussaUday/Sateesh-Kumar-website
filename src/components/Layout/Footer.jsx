// components/Footer.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowUp, Youtube } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Awards', href: '#awards' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' }
  ];

  

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/puttaguntavsateeshofficial/', name: 'Facebook' },
    { icon: Twitter, href: '#', name: 'Twitter' },
    { icon: Instagram, href: 'https://www.instagram.com/puttagunta_v_sateesh/', name: 'Instagram' },
    { icon: Youtube, href: 'https://www.youtube.com/@PuttaguntaVSateesh', name: 'YouTube' } // Added YouTube
  ];

  return (
    <footer className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex items-center space-x-3 mb-6"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Puttagunta Venkata Sateesh Health Foundation</h3>
                  <p className="text-amber-200 text-sm">Serving Since 2004</p>
                </div>
              </motion.div>
              
              <p className="text-amber-200 mb-6 leading-relaxed">
                Dedicated to uplifting lives through compassionate service, sustainable initiatives, 
                and community development for over 20 years.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ 
                        scale: 1.1, 
                        y: -2,
                        transition: { duration: 0.2 }
                      }}
                      className="w-10 h-10 bg-amber-700/50 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-amber-600 transition-colors duration-300 border border-amber-600/30"
                    >
                      <IconComponent className="w-4 h-4" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="text-lg font-bold mb-6 text-amber-300">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <a
                      href={link.href}
                      className="text-amber-200 hover:text-amber-400 transition-colors duration-300 flex items-center space-x-2 group"
                    >
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span>{link.name}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="text-lg font-bold mb-6 text-amber-300">Contact Info</h4>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center space-x-3 group"
                >
                  <div className="w-10 h-10 bg-amber-700/50 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-amber-600 transition-colors duration-300 border border-amber-600/30">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-amber-200 text-sm">Email</p>
                    <p className="text-white font-semibold">sateeshkumar@globalservicetrust.org</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center space-x-3 group"
                >
                  <div className="w-10 h-10 bg-amber-700/50 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-amber-600 transition-colors duration-300 border border-amber-600/30">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-amber-200 text-sm">Phone</p>
                    <p className="text-white font-semibold">+91 XXXXXXXXXX</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center space-x-3 group"
                >
                  <div className="w-10 h-10 bg-amber-700/50 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-amber-600 transition-colors duration-300 border border-amber-600/30">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-amber-200 text-sm">Location</p>
                    <p className="text-white font-semibold">Andhra Pradesh, India</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-amber-700/50 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-amber-300 text-sm text-center md:text-left"
            >
              © 2024 Puttagunta Venkata Sateesh Health Foundation. All rights reserved. | Serving with ❤️ since 2004
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="flex items-center space-x-6 text-sm text-amber-300"
            >
              <a href="#" className="hover:text-amber-400 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-amber-400 transition-colors duration-300">
                Terms of Service
              </a>
              
              {/* Scroll to Top Button */}
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={scrollToTop}
                className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center hover:bg-amber-500 transition-colors duration-300 border border-amber-500/30"
              >
                <ArrowUp className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl"></div>
    </footer>
  );
};

export default Footer;
