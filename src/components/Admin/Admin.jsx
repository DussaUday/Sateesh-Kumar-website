import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CLOUDINARY_CLOUD_NAME = 'drc8bufjn'
const CLOUDINARY_UPLOAD_PRESET = 'Portfolio'

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('gallery')
  const [galleryItems, setGalleryItems] = useState([])
  const [awards, setAwards] = useState([])
  const [services, setServices] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'authenticated') {
      setIsAuthenticated(true)
      fetchData()
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (username === 'sateesh-kumar' && password === 'sateesh-kumar-portfolio') {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuth', 'authenticated')
      fetchData()
    } else {
      alert('Invalid credentials')
    }
  }

  const fetchData = async () => {
    try {
      // Fetch existing data from API
      const [galleryRes, awardsRes, servicesRes] = await Promise.all([
        axios.get('/api/gallery'),
        axios.get('/api/awards'),
        axios.get('/api/services')
      ])
      setGalleryItems(galleryRes.data)
      setAwards(awardsRes.data)
      setServices(servicesRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleImageUpload = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      )
      return response.data.secure_url
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  const addGalleryItem = async (item) => {
    try {
      const imageUrl = await handleImageUpload(item.image)
      const newItem = { ...item, image: imageUrl, createdAt: new Date() }
      const response = await axios.post('/api/gallery', newItem)
      setGalleryItems(prev => [response.data, ...prev])
    } catch (error) {
      console.error('Error adding gallery item:', error)
    }
  }

  const updateGalleryItem = async (id, updates) => {
    try {
      const response = await axios.put(`/api/gallery/${id}`, updates)
      setGalleryItems(prev => prev.map(item => 
        item._id === id ? response.data : item
      ))
    } catch (error) {
      console.error('Error updating gallery item:', error)
    }
  }

  const deleteGalleryItem = async (id) => {
    try {
      await axios.delete(`/api/gallery/${id}`)
      setGalleryItems(prev => prev.filter(item => item._id !== id))
    } catch (error) {
      console.error('Error deleting gallery item:', error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-6 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <button
            onClick={() => {
              localStorage.removeItem('adminAuth')
              navigate('/')
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {['gallery', 'awards', 'services', 'about'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'gallery' && (
              <GalleryManager
                items={galleryItems}
                onAdd={addGalleryItem}
                onUpdate={updateGalleryItem}
                onDelete={deleteGalleryItem}
              />
            )}
            {/* Add other tab components */}
          </div>
        </div>
      </div>
    </div>
  )
}

const GalleryManager = ({ items, onAdd, onUpdate, onDelete }) => {
  const [newItem, setNewItem] = useState({ title: '', description: '', image: null })

  const handleFileChange = (e) => {
    setNewItem(prev => ({ ...prev, image: e.target.files[0] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newItem.image) {
      onAdd(newItem)
      setNewItem({ title: '', description: '', image: null })
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={newItem.title}
          onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item._id} className="border rounded-lg p-4">
            <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded" />
            <h3 className="font-semibold mt-2">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
            <div className="flex space-x-2 mt-2">
              <button className="text-blue-500">Edit</button>
              <button 
                onClick={() => onDelete(item._id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Admin