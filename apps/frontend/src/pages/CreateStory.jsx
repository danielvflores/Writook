import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../config/AuthContext.jsx';

export default function CreateStory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    synopsis: '',
    genres: [],
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const availableGenres = [
    'Fantasía', 'Romance', 'Aventura', 'Misterio', 'Ciencia Ficción', 
    'Horror', 'Drama', 'Comedia', 'Slice of Life', 'Histórico', "Fanfics"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenreToggle = (genre) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      showNotification('Please enter a title for your story', 'warning');
      return;
    }
    
    if (!formData.synopsis.trim()) {
      showNotification('Please write a synopsis', 'warning');
      return;
    }

    if (formData.genres.length === 0) {
      showNotification('Please select at least one genre', 'warning');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        showNotification('You are not authenticated. Please log in.', 'error');
        navigate('/login');
        return;
      }

      const storyData = {
        title: formData.title.trim(),
        synopsis: formData.synopsis.trim(),
        genres: formData.genres,
        tags: formData.tags,
        author: {
          username: user.username,
          displayName: user.displayName || user.username,
          bio: user.bio || "Writer on Writook",
          profilePictureUrl: user.profilePictureUrl || null
        },
        chapters: [],
        rating: 0.0
      };

      const response = await fetch('http://localhost:8080/api/v1/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(storyData)
      });

      if (response.ok) {
        const createdStory = await response.json();
        showNotification('Story created successfully! 📚', 'success');
        navigate(`/myworks/${createdStory.id}`);
      } else {
        throw new Error('Error creating story');
      }
      
    } catch (error) {
      showNotification('Error creating story. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const NotificationBanner = () => {
    if (!notification) return null;

    const styles = {
      success: 'bg-green-100 border-green-400 text-green-700',
      error: 'bg-red-100 border-red-400 text-red-700',
      warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
      info: 'bg-blue-100 border-blue-400 text-blue-700'
    };

    return (
      <div className={`fixed top-4 right-4 z-50 p-4 border-l-4 rounded-lg shadow-lg ${styles[notification.type]}`}>
        <div className="flex items-center">
          <span className="mr-3">
            {notification.type === 'success' && '✅'}
            {notification.type === 'error' && '❌'}
            {notification.type === 'warning' && '⚠️'}
            {notification.type === 'info' && 'ℹ️'}
          </span>
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NotificationBanner />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Story</h1>
          <p className="text-gray-600">Share your imagination with the world</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Story Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. The Lost Kingdom of Dragons"
              className="w-full text-xl font-semibold border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 outline-none"
              maxLength="100"
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.title.length}/100 characters
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Synopsis *
            </label>
            <textarea
              name="synopsis"
              value={formData.synopsis}
              onChange={handleInputChange}
              placeholder="Describe what your story is about. What adventures await your readers?"
              className="w-full h-32 border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 outline-none resize-none"
              maxLength="500"
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.synopsis.length}/500 characters
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Genres * (select up to 3)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableGenres.map(genre => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => handleGenreToggle(genre)}
                  disabled={!formData.genres.includes(genre) && formData.genres.length >= 3}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    formData.genres.includes(genre)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${(!formData.genres.includes(genre) && formData.genres.length >= 3) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {genre}
                </button>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Selected: {formData.genres.length}/3
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (optional)
            </label>
            <input
              type="text"
              onChange={handleTagsChange}
              placeholder="adventure, magic, friendship (separate with commas)"
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 outline-none"
            />
            <div className="text-xs text-gray-500 mt-1">
              Separate tags with commas
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/myworks')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? '⏳ Creating...' : '📚 Create Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
