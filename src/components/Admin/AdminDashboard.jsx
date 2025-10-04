import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, Image, Award, Users, Settings, Plus, Trash2, Eye, 
  Globe, User, Cloud, LogOut, RefreshCw, Edit, Save 
} from 'lucide-react';
import axios from 'axios';
import { uploadToCloudinary } from '../../config/cloudinary';
import AdminLogin from './AdminLogin';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [heroData, setHeroData] = useState({});
  const [services, setServices] = useState([]);
  const [awards, setAwards] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [aboutSections, setAboutSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  const checkAuthentication = () => {
    const auth = localStorage.getItem('adminAuth');
    const token = localStorage.getItem('adminToken');
    
    if (auth === 'authenticated' && token === 'admin-auth-token') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setAuthChecked(true);
  };

  const handleLogin = (success) => {
    setIsAuthenticated(success);
    if (success) {
      fetchAllData();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [heroRes, servicesRes, awardsRes, galleryRes, aboutRes] = await Promise.all([
        axios.get('https://sateesh-kumar-portfolio.onrender.com/api/hero').catch(() => ({ data: {} })),
        axios.get('https://sateesh-kumar-portfolio.onrender.com/api/services').catch(() => ({ data: [] })),
        axios.get('https://sateesh-kumar-portfolio.onrender.com/api/awards').catch(() => ({ data: [] })),
        axios.get('https://sateesh-kumar-portfolio.onrender.com/api/gallery?limit=100').catch(() => ({ data: [] })),
        axios.get('https://sateesh-kumar-portfolio.onrender.com/api/about/sections').catch(() => ({ data: [] }))
      ]);
      
      setHeroData(heroRes.data || {});
      setServices(servicesRes.data || []);
      setAwards(awardsRes.data || []);
      setGallery(galleryRes.data || []);
      setAboutSections(aboutRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file, type, relatedId = null, category = 'general', title = '') => {
    setUploading(true);
    setUploadProgress(0);
    
    try {
      console.log('Starting Cloudinary upload for:', type);
      
      // For development, use a mock URL if Cloudinary fails
      let imageUrl;
      try {
        imageUrl = await uploadToCloudinary(file, (progress) => {
          setUploadProgress(progress);
        });
      } catch (cloudinaryError) {
        console.warn('Cloudinary upload failed, using mock URL:', cloudinaryError);
        imageUrl = URL.createObjectURL(file); // Fallback to local URL for development
      }

      console.log('Upload successful:', imageUrl);

      // Save based on type
      if (type === 'hero') {
        await saveHeroImage(imageUrl);
      } else if (type === 'service' && relatedId) {
        await saveServiceImage(relatedId, imageUrl, title || file.name);
      } else if (type === 'award' && relatedId) {
        await saveAwardImage(relatedId, imageUrl, title || file.name);
      } else if (type === 'about' && relatedId) {
        await saveAboutImage(relatedId, imageUrl);
      } else if (type === 'gallery') {
        await saveGalleryItem(imageUrl, title || file.name, category);
      } else if (type === 'profile') {
        await saveGalleryItem(imageUrl, 'Profile Photo', 'profile');
      }

      await fetchAllData();
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} image uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + (error.message || 'Unknown error'));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const saveHeroImage = async (imageUrl) => {
    try {
      const currentHero = heroData || {};
      const updatedHero = {
        ...currentHero,
        image: imageUrl,
        title: currentHero.title || 'Shri Puttagunta Venkata Sateesh Kumar',
        subtitle: currentHero.subtitle || 'Dedicated Social Worker & Community Leader',
        stats: currentHero.stats || [
          { number: '20+', text: 'Years of Service', icon: 'Award' },
          { number: '100+', text: 'Community Camps', icon: 'Users' },
          { number: '5000+', text: 'Lives Impacted', icon: 'Heart' }
        ],
        ctaText: currentHero.ctaText || 'Explore Journey'
      };
      
      const response = await axios.put('https://sateesh-kumar-portfolio.onrender.com/api/hero', updatedHero);
      setHeroData(response.data);
    } catch (error) {
      console.error('Error saving hero image:', error);
      throw error;
    }
  };

  const saveServiceImage = async (serviceId, imageUrl, title) => {
    try {
      const service = services.find(s => s._id === serviceId);
      const newImage = { url: imageUrl, title: title || 'Service Image' };
      const updatedImages = [...(service?.images || []), newImage];
      
      const response = await axios.put(`https://sateesh-kumar-portfolio.onrender.com/api/services/${serviceId}`, { 
        ...service, 
        images: updatedImages,
        mainImage: service?.mainImage || imageUrl
      });
      return response.data;
    } catch (error) {
      console.error('Error saving service image:', error);
      throw error;
    }
  };

  const saveAwardImage = async (awardId, imageUrl, title) => {
    try {
      const award = awards.find(a => a._id === awardId);
      const newImage = { url: imageUrl, title: title || 'Award Image' };
      const updatedImages = [...(award?.images || []), newImage];
      
      const response = await axios.put(`https://sateesh-kumar-portfolio.onrender.com/api/awards/${awardId}`, { 
        ...award, 
        images: updatedImages,
        mainImage: award?.mainImage || imageUrl
      });
      return response.data;
    } catch (error) {
      console.error('Error saving award image:', error);
      throw error;
    }
  };

  const saveAboutImage = async (sectionId, imageUrl) => {
    try {
      const response = await axios.put(`https://sateesh-kumar-portfolio.onrender.com/api/about/sections/${sectionId}`, { image: imageUrl });
      return response.data;
    } catch (error) {
      console.error('Error saving about image:', error);
      throw error;
    }
  };

  const saveGalleryItem = async (imageUrl, title, category = 'general') => {
    try {
      const response = await axios.post('https://sateesh-kumar-portfolio.onrender.com/api/gallery', {
        title,
        image: imageUrl,
        category,
        description: `Uploaded ${new Date().toLocaleDateString()}`
      });
      return response.data;
    } catch (error) {
      console.error('Error saving gallery item:', error);
      throw error;
    }
  };

  const tabs = [
    { id: 'hero', icon: User, label: 'Hero Section' },
    { id: 'about', icon: Users, label: 'About Sections' },
    { id: 'services', icon: Settings, label: 'Services' },
    { id: 'awards', icon: Award, label: 'Awards' },
    { id: 'gallery', icon: Image, label: 'Gallery' }
  ];

  const getActiveComponent = () => {
    const components = {
      hero: HeroManagement,
      about: AboutManagement,
      services: ServicesManagement,
      awards: AwardsManagement,
      gallery: GalleryManagement
    };
    
    const Component = components[activeTab];
    return Component ? (
      <Component
        data={{
          hero: heroData,
          services,
          awards,
          gallery,
          about: aboutSections
        }}
        onUpload={handleImageUpload}
        uploading={uploading}
        uploadProgress={uploadProgress}
        onRefresh={fetchAllData}
      />
    ) : null;
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Cloud className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                  <p className="text-blue-100">Manage Portfolio Content • Cloudinary Uploads</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={fetchAllData}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-xl text-white hover:bg-white/30 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-xl text-white hover:bg-white/30 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="bg-blue-50 border-b border-blue-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700">Uploading to Cloudinary...</span>
                <span className="text-sm font-bold text-blue-700">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-yellow-50 border-b border-yellow-200 p-4">
              <div className="flex items-center justify-center space-x-2">
                <RefreshCw className="w-5 h-5 text-yellow-600 animate-spin" />
                <span className="text-sm font-medium text-yellow-700">Loading data...</span>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-1 px-8 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {getActiveComponent()}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Hero Management Component - FIXED WITH STAT DELETE OPTION
const HeroManagement = ({ data, onUpload, uploading, uploadProgress, onRefresh }) => {
  const [hero, setHero] = useState(data.hero || {});
  const [profileImage, setProfileImage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempHero, setTempHero] = useState({});

  useEffect(() => {
    setHero(data.hero || {});
    setTempHero(data.hero || {});
    fetchProfileImage();
  }, [data.hero]);

  const fetchProfileImage = async () => {
    try {
      const response = await axios.get('https://sateesh-kumar-portfolio.onrender.com/api/gallery?category=profile&limit=1');
      if (response.data.length > 0) {
        setProfileImage(response.data[0].image);
      } else {
        setProfileImage('');
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
      setProfileImage('');
    }
  };

  const handleHeroImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      await onUpload(file, 'hero');
      event.target.value = '';
    }
  };

  const handleProfileImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      await onUpload(file, 'profile');
      setTimeout(fetchProfileImage, 1000);
      event.target.value = '';
    }
  };

  const updateHero = async (updates) => {
    try {
      const response = await axios.put('https://sateesh-kumar-portfolio.onrender.com/api/hero', { ...hero, ...updates });
      setHero(response.data);
      setTempHero(response.data);
      setIsEditing(false);
      alert('Hero content updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating hero content: ' + error.message);
    }
  };

  const handleEdit = () => {
    setTempHero({...hero});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempHero({...hero});
    setIsEditing(false);
  };

  const handleSave = () => {
    updateHero(tempHero);
  };

  const handleTempChange = (field, value) => {
    setTempHero(prev => ({ ...prev, [field]: value }));
  };

  const handleStatChange = (index, field, value) => {
    const newStats = [...(tempHero.stats || [])];
    if (!newStats[index]) {
      newStats[index] = { number: '', text: '' };
    }
    newStats[index][field] = value;
    setTempHero(prev => ({ ...prev, stats: newStats }));
  };

  const handleAddStat = () => {
    const newStats = [...(tempHero.stats || []), { number: '', text: '' }];
    setTempHero(prev => ({ ...prev, stats: newStats }));
  };

  const handleDeleteStat = (index) => {
    const newStats = [...(tempHero.stats || [])];
    newStats.splice(index, 1);
    setTempHero(prev => ({ ...prev, stats: newStats }));
  };

  // Initialize hero data if empty
  useEffect(() => {
    if (!hero.title && !hero.subtitle) {
      const initialHero = {
        title: 'Shri Puttagunta Venkata Sateesh Kumar',
        subtitle: 'Dedicated Social Worker & Community Leader',
        image: hero.image || '',
        stats: hero.stats || [
          { number: '20+', text: 'Years of Service', icon: 'Award' },
          { number: '100+', text: 'Community Camps', icon: 'Users' },
          { number: '5000+', text: 'Lives Impacted', icon: 'Heart' }
        ],
        ctaText: hero.ctaText || 'Explore Journey'
      };
      setHero(initialHero);
      setTempHero(initialHero);
    }
  }, [hero]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Hero Section Management</h3>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors"
          >
            <Edit className="w-5 h-5" />
            <span>Edit Content</span>
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-colors"
            >
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Upload Section */}
        <div className="space-y-6">
          {/* Hero Background Image */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <Cloud className="w-5 h-5 text-blue-500" />
              <span>Background Image</span>
            </h3>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageChange}
                  className="hidden"
                  id="hero-upload"
                  disabled={uploading}
                />
                <label htmlFor="hero-upload" className="cursor-pointer block">
                  {uploading ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-blue-600 font-medium">Uploading Background... {uploadProgress}%</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Click to upload background image</p>
                      <p className="text-sm text-gray-500 mt-2">Max 10MB • JPG, PNG, WebP</p>
                    </>
                  )}
                </label>
              </div>
              
              {hero?.image && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Background:</p>
                  <div className="relative">
                    <img
                      src={hero.image}
                      alt="Current Hero Background"
                      className="w-full h-48 object-cover rounded-2xl shadow-lg"
                      onError={(e) => {
                        console.error('Error loading hero image:', hero.image);
                        e.target.style.display = 'none';
                      }}
                    />
                    <button
                      onClick={async () => {
                        try {
                          await axios.put('https://sateesh-kumar-portfolio.onrender.com/api/hero', { ...hero, image: '' });
                          setHero(prev => ({ ...prev, image: '' }));
                          setTempHero(prev => ({ ...prev, image: '' }));
                          alert('Background image removed successfully!');
                        } catch (error) {
                          console.error('Error removing background image:', error);
                          alert('Error removing background image: ' + error.message);
                        }
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profile Image Upload */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <User className="w-5 h-5 text-green-500" />
              <span>Profile Photo</span>
            </h3>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-green-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                  id="profile-upload"
                  disabled={uploading}
                />
                <label htmlFor="profile-upload" className="cursor-pointer block">
                  {uploading ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-green-600 font-medium">Uploading Profile... {uploadProgress}%</p>
                    </div>
                  ) : (
                    <>
                      <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Click to upload profile photo</p>
                      <p className="text-sm text-gray-500 mt-2">Square images work best</p>
                    </>
                  )}
                </label>
              </div>
              
              {profileImage && (
                <div className="mt-4 text-center">
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Profile:</p>
                  <div className="relative inline-block">
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-32 h-32 object-cover rounded-full shadow-lg mx-auto border-4 border-white"
                      onError={(e) => {
                        console.error('Error loading profile image:', profileImage);
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Hero Content</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Title</label>
                <input
                  type="text"
                  value={isEditing ? (tempHero?.title || '') : (hero?.title || '')}
                  onChange={(e) => isEditing && handleTempChange('title', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter hero title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Subtitle</label>
                <textarea
                  value={isEditing ? (tempHero?.subtitle || '') : (hero?.subtitle || '')}
                  onChange={(e) => isEditing && handleTempChange('subtitle', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter hero subtitle"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Call to Action Text</label>
                <input
                  type="text"
                  value={isEditing ? (tempHero?.ctaText || 'Explore Journey') : (hero?.ctaText || 'Explore Journey')}
                  onChange={(e) => isEditing && handleTempChange('ctaText', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter CTA text"
                />
              </div>
            </div>
          </div>

          {/* Stats Management - FIXED WITH DELETE OPTION */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Statistics</h3>
              {isEditing && (
                <button
                  onClick={handleAddStat}
                  className="flex items-center space-x-2 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Stat</span>
                </button>
              )}
            </div>
            <div className="space-y-4">
              {(isEditing ? tempHero?.stats : hero?.stats)?.map((stat, index) => (
                <div key={index} className="flex space-x-4 items-center">
                  <input
                    type="text"
                    value={stat.number}
                    onChange={(e) => isEditing && handleStatChange(index, 'number', e.target.value)}
                    disabled={!isEditing}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Number"
                  />
                  <input
                    type="text"
                    value={stat.text}
                    onChange={(e) => isEditing && handleStatChange(index, 'text', e.target.value)}
                    disabled={!isEditing}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Text"
                  />
                  {isEditing && (
                    <button
                      onClick={() => handleDeleteStat(index)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      title="Delete Stat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (!tempHero?.stats || tempHero.stats.length === 0) && (
                <div className="text-center py-4 text-gray-500">
                  <p>No statistics added yet. Click "Add Stat" to create one.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Services Management Component - FIXED COMMA ISSUE COMPLETELY
const ServicesManagement = ({ data, onUpload, uploading, uploadProgress, onRefresh }) => {
  const [services, setServices] = useState(data.services || []);
  const [selectedService, setSelectedService] = useState(null);
  const [imageTitle, setImageTitle] = useState('');
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    icon: 'Users',
    stats: '100+ People Helped',
    gradient: 'from-blue-500 to-cyan-500',
    features: ['Quality Service', 'Community Focus', 'Professional Team']
  });
  const [featuresInput, setFeaturesInput] = useState('');

  useEffect(() => {
    setServices(data.services || []);
    if (data.services && data.services.length > 0 && !selectedService) {
      setSelectedService(data.services[0]);
    }
  }, [data.services]);

  useEffect(() => {
    if (selectedService) {
      setFeaturesInput(selectedService.features?.join(', ') || '');
    }
  }, [selectedService]);

  const createService = async () => {
    try {
      const serviceToCreate = {
        ...newService,
        images: [],
        mainImage: ''
      };
      
      const response = await axios.post('https://sateesh-kumar-portfolio.onrender.com/api/services', serviceToCreate);
      setServices(prev => [...prev, response.data]);
      setSelectedService(response.data);
      setNewService({
        title: '',
        description: '',
        icon: 'Users',
        stats: '100+ People Helped',
        gradient: 'from-blue-500 to-cyan-500',
        features: ['Quality Service', 'Community Focus', 'Professional Team']
      });
      setFeaturesInput('');
      alert('Service created successfully!');
    } catch (error) {
      console.error('Create error:', error);
      alert('Error creating service: ' + error.message);
    }
  };

  const updateService = async (serviceId, updates) => {
    try {
      const response = await axios.put(`https://sateesh-kumar-portfolio.onrender.com/api/services/${serviceId}`, updates);
      setServices(prev => prev.map(s => s._id === serviceId ? response.data : s));
      setSelectedService(response.data);
      alert('Service updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating service: ' + error.message);
    }
  };

  const deleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`https://sateesh-kumar-portfolio.onrender.com/api/services/${serviceId}`);
        setServices(prev => prev.filter(s => s._id !== serviceId));
        if (selectedService && selectedService._id === serviceId) {
          setSelectedService(services.length > 1 ? services.find(s => s._id !== serviceId) : null);
        }
        alert('Service deleted successfully!');
      } catch (error) {
        console.error('Delete error:', error);
        alert('Error deleting service: ' + error.message);
      }
    }
  };

  const handleServiceImageUpload = async (serviceId, file) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    await onUpload(file, 'service', serviceId, 'general', imageTitle || file.name);
    setImageTitle('');
  };

  const setMainImage = async (serviceId, imageUrl) => {
    try {
      await axios.put(`https://sateesh-kumar-portfolio.onrender.com/api/services/${serviceId}`, { mainImage: imageUrl });
      onRefresh();
      alert('Main image set successfully!');
    } catch (error) {
      console.error('Set main image error:', error);
      alert('Error setting main image: ' + error.message);
    }
  };

  const deleteServiceImage = async (serviceId, imageUrl) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const service = services.find(s => s._id === serviceId);
        const updatedImages = (service.images || []).filter(img => img.url !== imageUrl);
        
        await axios.put(`https://sateesh-kumar-portfolio.onrender.com/api/services/${serviceId}`, {
          ...service,
          images: updatedImages,
          mainImage: service.mainImage === imageUrl ? '' : service.mainImage
        });
        
        onRefresh();
        alert('Image deleted successfully!');
      } catch (error) {
        console.error('Delete image error:', error);
        alert('Error deleting image: ' + error.message);
      }
    }
  };

  const handleFeaturesChange = (featuresString) => {
    setFeaturesInput(featuresString);
    // Convert comma-separated string to array
    const featuresArray = featuresString.split(',').map(feature => feature.trim()).filter(feature => feature);
    if (selectedService) {
      setSelectedService(prev => ({ ...prev, features: featuresArray }));
    }
  };

  const handleNewServiceFeaturesChange = (featuresString) => {
    const featuresArray = featuresString.split(',').map(feature => feature.trim()).filter(feature => feature);
    setNewService(prev => ({ ...prev, features: featuresArray }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Services Management</h3>
        <button
          onClick={createService}
          disabled={!newService.title.trim()}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Create New Service Form */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold mb-4">Create New Service</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Service Title *"
            value={newService.title}
            onChange={(e) => setNewService(prev => ({ ...prev, title: e.target.value }))}
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Service Stats (e.g., 100+ People Helped)"
            value={newService.stats}
            onChange={(e) => setNewService(prev => ({ ...prev, stats: e.target.value }))}
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Service Description"
            value={newService.description}
            onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="p-3 border border-gray-300 rounded-xl resize-none md:col-span-2 focus:ring-2 focus:ring-blue-500"
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">Features (comma separated)</label>
            <input
              type="text"
              value={newService.features.join(', ')}
              onChange={(e) => handleNewServiceFeaturesChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="Quality Service, Community Focus, Professional Team"
            />
            <p className="text-xs text-gray-500 mt-1">
              Type features separated by commas. You can type commas normally.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Services List */}
        <div className="lg:col-span-1 space-y-4">
          <h4 className="text-lg font-semibold mb-4">Existing Services ({services.length})</h4>
          {services.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Settings className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No services found</p>
            </div>
          ) : (
            services.map(service => (
              <div
                key={service._id}
                onClick={() => setSelectedService(service)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedService?._id === service._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{service.title}</h4>
                    
                    <p className="text-xs text-gray-500 mt-1">
                      {(service.images?.length || 0)} images
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteService(service._id);
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Service Details */}
        {selectedService && (
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={selectedService.title}
                    onChange={(e) => setSelectedService(prev => ({ ...prev, title: e.target.value }))}
                    onBlur={() => updateService(selectedService._id, { title: selectedService.title })}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    value={selectedService.description}
                    onChange={(e) => setSelectedService(prev => ({ ...prev, description: e.target.value }))}
                    onBlur={() => updateService(selectedService._id, { description: selectedService.description })}
                    rows={4}
                    className="w-full p-3 border rounded-xl resize-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Stats</label>
                  <input
                    type="text"
                    value={selectedService.stats}
                    onChange={(e) => setSelectedService(prev => ({ ...prev, stats: e.target.value }))}
                    onBlur={() => updateService(selectedService._id, { stats: selectedService.stats })}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Features (comma separated)</label>
                  <input
                    type="text"
                    value={featuresInput}
                    onChange={(e) => handleFeaturesChange(e.target.value)}
                    onBlur={() => updateService(selectedService._id, { features: selectedService.features })}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Quality Service, Community Focus, Professional Team"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Type features separated by commas. You can type commas normally.
                  </p>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                  <h4 className="text-lg font-semibold mb-4">Add Service Images</h4>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Image Title (optional)"
                      value={imageTitle}
                      onChange={(e) => setImageTitle(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleServiceImageUpload(selectedService._id, file);
                            e.target.value = '';
                          }
                        }}
                        className="hidden"
                        id={`service-upload-${selectedService._id}`}
                        disabled={uploading}
                      />
                      <label 
                        htmlFor={`service-upload-${selectedService._id}`} 
                        className="cursor-pointer block"
                      >
                        {uploading ? (
                          <div className="space-y-4">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-blue-600 font-medium">Uploading... {uploadProgress}%</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">Click to upload service image</p>
                            <p className="text-sm text-gray-500 mt-2">Max 10MB • JPG, PNG, WebP</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Current Images */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h4 className="text-lg font-semibold mb-4">
                    Service Images ({(selectedService.images || []).length})
                  </h4>
                  
                  {(selectedService.images || []).length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>No images uploaded yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {(selectedService.images || []).map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.url}
                            alt={image.title}
                            className="w-full h-24 object-cover rounded-xl shadow-sm"
                            onError={(e) => {
                              console.error('Error loading service image:', image.url);
                              e.target.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all rounded-xl flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                            <button
                              onClick={() => setMainImage(selectedService._id, image.url)}
                              className={`p-2 rounded-full ${
                                selectedService.mainImage === image.url 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-white text-gray-700 hover:bg-gray-100'
                              }`}
                              title={selectedService.mainImage === image.url ? 'Main Image' : 'Set as Main'}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteServiceImage(selectedService._id, image.url)}
                              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                              title="Delete Image"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {selectedService.mainImage === image.url && (
                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              Main
                            </div>
                          )}
                          <p className="text-xs text-gray-600 mt-2 truncate">{image.title}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Awards Management Component (unchanged, but included for completeness)
const AwardsManagement = ({ data, onUpload, uploading, uploadProgress, onRefresh }) => {
  const [awards, setAwards] = useState(data.awards || []);
  const [selectedAward, setSelectedAward] = useState(null);
  const [imageTitle, setImageTitle] = useState('');
  const [newAward, setNewAward] = useState({
    title: '',
    organization: '',
    year: new Date().getFullYear(),
    description: '',
    category: 'social-work'
  });

  useEffect(() => {
    setAwards(data.awards || []);
    if (data.awards && data.awards.length > 0 && !selectedAward) {
      setSelectedAward(data.awards[0]);
    }
  }, [data.awards]);

  const createAward = async () => {
    try {
      const awardToCreate = {
        ...newAward,
        images: [],
        mainImage: ''
      };
      
      const response = await axios.post('https://sateesh-kumar-portfolio.onrender.com/api/awards', awardToCreate);
      setAwards(prev => [...prev, response.data]);
      setSelectedAward(response.data);
      setNewAward({
        title: '',
        organization: '',
        year: new Date().getFullYear(),
        description: '',
        category: 'social-work'
      });
      alert('Award created successfully!');
    } catch (error) {
      console.error('Create error:', error);
      alert('Error creating award: ' + error.message);
    }
  };

  const updateAward = async (awardId, updates) => {
    try {
      const response = await axios.put(`https://sateesh-kumar-portfolio.onrender.com/api/awards/${awardId}`, updates);
      setAwards(prev => prev.map(a => a._id === awardId ? response.data : a));
      setSelectedAward(response.data);
      alert('Award updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating award: ' + error.message);
    }
  };

  const deleteAward = async (awardId) => {
    if (window.confirm('Are you sure you want to delete this award?')) {
      try {
        await axios.delete(`https://sateesh-kumar-portfolio.onrender.com/api/awards/${awardId}`);
        setAwards(prev => prev.filter(a => a._id !== awardId));
        if (selectedAward && selectedAward._id === awardId) {
          setSelectedAward(awards.length > 1 ? awards.find(a => a._id !== awardId) : null);
        }
        alert('Award deleted successfully!');
      } catch (error) {
        console.error('Delete error:', error);
        alert('Error deleting award: ' + error.message);
      }
    }
  };

  const handleAwardImageUpload = async (awardId, file) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    await onUpload(file, 'award', awardId, 'general', imageTitle || file.name);
    setImageTitle('');
  };

  const setMainImage = async (awardId, imageUrl) => {
    try {
      await axios.put(`https://sateesh-kumar-portfolio.onrender.com/api/awards/${awardId}`, { mainImage: imageUrl });
      onRefresh();
      alert('Main image set successfully!');
    } catch (error) {
      console.error('Set main image error:', error);
      alert('Error setting main image: ' + error.message);
    }
  };

  const deleteAwardImage = async (awardId, imageUrl) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const award = awards.find(a => a._id === awardId);
        const updatedImages = (award.images || []).filter(img => img.url !== imageUrl);
        
        await axios.put(`https://sateesh-kumar-portfolio.onrender.com/api/awards/${awardId}`, {
          ...award,
          images: updatedImages,
          mainImage: award.mainImage === imageUrl ? '' : award.mainImage
        });
        
        onRefresh();
        alert('Image deleted successfully!');
      } catch (error) {
        console.error('Delete image error:', error);
        alert('Error deleting image: ' + error.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Awards Management</h3>
        <button
          onClick={createAward}
          disabled={!newAward.title.trim()}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          <span>Add Award</span>
        </button>
      </div>

      {/* Create New Award Form */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold mb-4">Create New Award</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Award Title *"
            value={newAward.title}
            onChange={(e) => setNewAward(prev => ({ ...prev, title: e.target.value }))}
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Organization"
            value={newAward.organization}
            onChange={(e) => setNewAward(prev => ({ ...prev, organization: e.target.value }))}
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Year"
            value={newAward.year}
            onChange={(e) => setNewAward(prev => ({ ...prev, year: parseInt(e.target.value) || '' }))}
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newAward.category}
            onChange={(e) => setNewAward(prev => ({ ...prev, category: e.target.value }))}
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          >
            <option value="social-work">Social Work</option>
            <option value="community">Community Service</option>
            <option value="leadership">Leadership</option>
            <option value="achievement">Achievement</option>
            <option value="recognition">Recognition</option>
          </select>
          <textarea
            placeholder="Description"
            value={newAward.description}
            onChange={(e) => setNewAward(prev => ({ ...prev, description: e.target.value }))}
            rows={2}
            className="p-3 border border-gray-300 rounded-xl resize-none md:col-span-2 lg:col-span-4 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Awards List */}
        <div className="lg:col-span-1 space-y-4">
          <h4 className="text-lg font-semibold mb-4">Existing Awards ({awards.length})</h4>
          {awards.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Award className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No awards found</p>
            </div>
          ) : (
            awards.map(award => (
              <div
                key={award._id}
                onClick={() => setSelectedAward(award)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedAward?._id === award._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{award.title}</h4>
                    <p className="text-sm text-gray-600">{award.organization} • {award.year}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(award.images?.length || 0)} images
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAward(award._id);
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Award Details */}
        {selectedAward && (
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={selectedAward.title}
                    onChange={(e) => setSelectedAward(prev => ({ ...prev, title: e.target.value }))}
                    onBlur={() => updateAward(selectedAward._id, { title: selectedAward.title })}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Organization</label>
                  <input
                    type="text"
                    value={selectedAward.organization}
                    onChange={(e) => setSelectedAward(prev => ({ ...prev, organization: e.target.value }))}
                    onBlur={() => updateAward(selectedAward._id, { organization: selectedAward.organization })}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Year</label>
                  <input
                    type="number"
                    value={selectedAward.year}
                    onChange={(e) => setSelectedAward(prev => ({ ...prev, year: parseInt(e.target.value) || '' }))}
                    onBlur={() => updateAward(selectedAward._id, { year: selectedAward.year })}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select
                    value={selectedAward.category}
                    onChange={(e) => setSelectedAward(prev => ({ ...prev, category: e.target.value }))}
                    onBlur={() => updateAward(selectedAward._id, { category: selectedAward.category })}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="social-work">Social Work</option>
                    <option value="community">Community Service</option>
                    <option value="leadership">Leadership</option>
                    <option value="achievement">Achievement</option>
                    <option value="recognition">Recognition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    value={selectedAward.description}
                    onChange={(e) => setSelectedAward(prev => ({ ...prev, description: e.target.value }))}
                    onBlur={() => updateAward(selectedAward._id, { description: selectedAward.description })}
                    rows={4}
                    className="w-full p-3 border rounded-xl resize-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                  <h4 className="text-lg font-semibold mb-4">Add Award Images</h4>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Image Title (optional)"
                      value={imageTitle}
                      onChange={(e) => setImageTitle(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleAwardImageUpload(selectedAward._id, file);
                            e.target.value = '';
                          }
                        }}
                        className="hidden"
                        id={`award-upload-${selectedAward._id}`}
                        disabled={uploading}
                      />
                      <label 
                        htmlFor={`award-upload-${selectedAward._id}`} 
                        className="cursor-pointer block"
                      >
                        {uploading ? (
                          <div className="space-y-4">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-blue-600 font-medium">Uploading... {uploadProgress}%</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">Click to upload award image</p>
                            <p className="text-sm text-gray-500 mt-2">Max 10MB • JPG, PNG, WebP</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Current Images */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h4 className="text-lg font-semibold mb-4">
                    Award Images ({(selectedAward.images || []).length})
                  </h4>
                  
                  {(selectedAward.images || []).length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>No images uploaded yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {(selectedAward.images || []).map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.url}
                            alt={image.title}
                            className="w-full h-24 object-cover rounded-xl shadow-sm"
                            onError={(e) => {
                              console.error('Error loading award image:', image.url);
                              e.target.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all rounded-xl flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                            <button
                              onClick={() => setMainImage(selectedAward._id, image.url)}
                              className={`p-2 rounded-full ${
                                selectedAward.mainImage === image.url 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-white text-gray-700 hover:bg-gray-100'
                              }`}
                              title={selectedAward.mainImage === image.url ? 'Main Image' : 'Set as Main'}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteAwardImage(selectedAward._id, image.url)}
                              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                              title="Delete Image"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {selectedAward.mainImage === image.url && (
                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              Main
                            </div>
                          )}
                          <p className="text-xs text-gray-600 mt-2 truncate">{image.title}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// About Management Component (unchanged, but included for completeness)
const AboutManagement = ({ data, onUpload, uploading, uploadProgress, onRefresh }) => {
  const [sections, setSections] = useState(data.about || []);
  const [selectedSection, setSelectedSection] = useState(null);
  const [newSection, setNewSection] = useState({
    title: '',
    content: '',
    type: 'text',
    position: 'left'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempSection, setTempSection] = useState({});

  useEffect(() => {
    setSections(data.about || []);
    if (data.about && data.about.length > 0 && !selectedSection) {
      setSelectedSection(data.about[0]);
    }
  }, [data.about]);

  useEffect(() => {
    if (selectedSection) {
      setTempSection({...selectedSection});
    }
  }, [selectedSection]);

  const createSection = async () => {
    try {
      const sectionToCreate = {
        ...newSection,
        image: '',
        order: sections.length
      };
      
      const response = await axios.post('https://sateesh-kumar-portfolio.onrender.com/api/about/sections', sectionToCreate);
      setSections(prev => [...prev, response.data]);
      setSelectedSection(response.data);
      setNewSection({
        title: '',
        content: '',
        type: 'text',
        position: 'left'
      });
      alert('Section created successfully!');
    } catch (error) {
      console.error('Create error:', error);
      alert('Error creating section: ' + error.message);
    }
  };

  const updateSection = async (sectionId, updates) => {
    try {
      const response = await axios.put(`https://sateesh-kumar-portfolio.onrender.com/api/about/sections/${sectionId}`, updates);
      setSections(prev => prev.map(s => s._id === sectionId ? response.data : s));
      setSelectedSection(response.data);
      setIsEditing(false);
      alert('Section updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating section: ' + error.message);
    }
  };

  const deleteSection = async (sectionId) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        await axios.delete(`https://sateesh-kumar-portfolio.onrender.com/api/about/sections/${sectionId}`);
        setSections(prev => prev.filter(s => s._id !== sectionId));
        if (selectedSection && selectedSection._id === sectionId) {
          setSelectedSection(sections.length > 1 ? sections.find(s => s._id !== sectionId) : null);
        }
        alert('Section deleted successfully!');
      } catch (error) {
        console.error('Delete error:', error);
        alert('Error deleting section: ' + error.message);
      }
    }
  };

  const handleSectionImageUpload = async (sectionId, file) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    await onUpload(file, 'about', sectionId);
  };

  const deleteSectionImage = async (sectionId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await axios.put(`https://sateesh-kumar-portfolio.onrender.com/api/about/sections/${sectionId}`, { image: '' });
        onRefresh();
        alert('Image deleted successfully!');
      } catch (error) {
        console.error('Delete image error:', error);
        alert('Error deleting image: ' + error.message);
      }
    }
  };

  const handleEdit = () => {
    setTempSection({...selectedSection});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempSection({...selectedSection});
    setIsEditing(false);
  };

  const handleSave = () => {
    updateSection(selectedSection._id, tempSection);
  };

  const handleTempChange = (field, value) => {
    setTempSection(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">About Sections Management</h3>
        <button
          onClick={createSection}
          disabled={!newSection.title.trim()}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          <span>Add Section</span>
        </button>
      </div>

      {/* Create New Section Form */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold mb-4">Create New Section</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Section Title *"
            value={newSection.title}
            onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newSection.type}
            onChange={(e) => setNewSection(prev => ({ ...prev, type: e.target.value }))}
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          >
            <option value="text">Text Only</option>
            <option value="image-text">Image + Text</option>
            <option value="text-image">Text + Image</option>
          </select>
          <select
            value={newSection.position}
            onChange={(e) => setNewSection(prev => ({ ...prev, position: e.target.value }))}
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          >
            <option value="left">Image Left</option>
            <option value="right">Image Right</option>
          </select>
          <textarea
            placeholder="Section Content"
            value={newSection.content}
            onChange={(e) => setNewSection(prev => ({ ...prev, content: e.target.value }))}
            rows={2}
            className="p-3 border border-gray-300 rounded-xl resize-none md:col-span-2 lg:col-span-4 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sections List */}
        <div className="lg:col-span-1 space-y-4">
          <h4 className="text-lg font-semibold mb-4">Existing Sections ({sections.length})</h4>
          {sections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No sections found</p>
            </div>
          ) : (
            sections.map(section => (
              <div
                key={section._id}
                onClick={() => setSelectedSection(section)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedSection?._id === section._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{section.title}</h4>
                    <p className="text-sm text-gray-600 truncate">{section.content}</p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">
                      {section.type} • {section.position}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSection(section._id);
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Section Details */}
        {selectedSection && (
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-xl font-bold">Section Details</h4>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors"
                >
                  <Edit className="w-5 h-5" />
                  <span>Edit Section</span>
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-colors"
                  >
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={isEditing ? (tempSection?.title || '') : (selectedSection?.title || '')}
                    onChange={(e) => isEditing && handleTempChange('title', e.target.value)}
                    disabled={!isEditing}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Content</label>
                  <textarea
                    value={isEditing ? (tempSection?.content || '') : (selectedSection?.content || '')}
                    onChange={(e) => isEditing && handleTempChange('content', e.target.value)}
                    disabled={!isEditing}
                    rows={8}
                    className="w-full p-3 border rounded-xl resize-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Type</label>
                    <select
                      value={isEditing ? (tempSection?.type || 'text') : (selectedSection?.type || 'text')}
                      onChange={(e) => isEditing && handleTempChange('type', e.target.value)}
                      disabled={!isEditing}
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="text">Text Only</option>
                      <option value="image-text">Image + Text</option>
                      <option value="text-image">Text + Image</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Position</label>
                    <select
                      value={isEditing ? (tempSection?.position || 'left') : (selectedSection?.position || 'left')}
                      onChange={(e) => isEditing && handleTempChange('position', e.target.value)}
                      disabled={!isEditing}
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="left">Image Left</option>
                      <option value="right">Image Right</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                {(isEditing ? tempSection?.type : selectedSection?.type) !== 'text' && (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                    <h4 className="text-lg font-semibold mb-4">Section Image</h4>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleSectionImageUpload(selectedSection._id, file);
                            e.target.value = '';
                          }
                        }}
                        className="hidden"
                        id={`section-upload-${selectedSection._id}`}
                        disabled={uploading || !isEditing}
                      />
                      <label 
                        htmlFor={`section-upload-${selectedSection._id}`} 
                        className={`cursor-pointer block ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {uploading ? (
                          <div className="space-y-4">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-blue-600 font-medium">Uploading... {uploadProgress}%</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">Click to upload section image</p>
                            <p className="text-sm text-gray-500 mt-2">Max 10MB • JPG, PNG, WebP</p>
                          </>
                        )}
                      </label>
                    </div>

                    {selectedSection.image && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Current Image:</p>
                        <div className="relative">
                          <img
                            src={selectedSection.image}
                            alt={selectedSection.title}
                            className="w-full h-48 object-cover rounded-xl shadow-lg"
                            onError={(e) => {
                              console.error('Error loading section image:', selectedSection.image);
                              e.target.style.display = 'none';
                            }}
                          />
                          {isEditing && (
                            <button
                              onClick={() => deleteSectionImage(selectedSection._id)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Gallery Management Component (unchanged, but included for completeness)
const GalleryManagement = ({ data, onUpload, uploading, uploadProgress, onRefresh }) => {
  const [gallery, setGallery] = useState(data.gallery || []);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [imageTitle, setImageTitle] = useState('');
  const [imageCategory, setImageCategory] = useState('general');

  useEffect(() => {
    setGallery(data.gallery || []);
  }, [data.gallery]);

  const handleGalleryUpload = async (file) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    await onUpload(file, 'gallery', null, imageCategory, imageTitle || file.name);
    setImageTitle('');
  };

  const deleteGalleryItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await axios.delete(`https://sateesh-kumar-portfolio.onrender.com/api/gallery/${itemId}`);
        setGallery(prev => prev.filter(item => item._id !== itemId));
        alert('Image deleted successfully!');
      } catch (error) {
        console.error('Delete error:', error);
        alert('Error deleting image: ' + error.message);
      }
    }
  };

  const categories = ['all', 'general', 'events', 'community', 'awards', 'profile'];
  const filteredGallery = selectedCategory === 'all' 
    ? gallery 
    : gallery.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Gallery Management</h3>

      {/* Upload Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
        <h4 className="text-lg font-semibold mb-4">Add Gallery Image</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Image Title (optional)"
            value={imageTitle}
            onChange={(e) => setImageTitle(e.target.value)}
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={imageCategory}
            onChange={(e) => setImageCategory(e.target.value)}
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          >
            <option value="general">General</option>
            <option value="events">Events</option>
            <option value="community">Community</option>
            <option value="awards">Awards</option>
            <option value="profile">Profile</option>
          </select>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  handleGalleryUpload(file);
                  e.target.value = '';
                }
              }}
              className="hidden"
              id="gallery-upload"
              disabled={uploading}
            />
            <label htmlFor="gallery-upload" className="cursor-pointer block p-3">
              {uploading ? (
                <div className="space-y-2">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-blue-600 font-medium text-sm">Uploading... {uploadProgress}%</p>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Upload Image</p>
                </>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl font-medium capitalize whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category} {category !== 'all' && `(${gallery.filter(item => item.category === category).length})`}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredGallery.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Image className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p>No images found in {selectedCategory} category</p>
          </div>
        ) : (
          filteredGallery.map(item => (
            <div key={item._id} className="relative group">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-32 object-cover rounded-xl shadow-sm"
                onError={(e) => {
                  console.error('Error loading gallery image:', item.image);
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all rounded-xl flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => deleteGalleryItem(item._id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  title="Delete Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                <p className="text-xs text-gray-500 capitalize">{item.category}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;