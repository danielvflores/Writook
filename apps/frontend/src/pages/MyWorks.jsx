import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../config/AuthContext.jsx';

export default function MyWorks() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (user?.username) {
      loadUserStories();
    }
  }, [user]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadUserStories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`http://localhost:8080/api/v1/stories/author/${user.username}`, {
        headers
      });
      
      if (response.ok) {
        const userStories = await response.json();
        setStories(userStories);
      } else if (response.status === 404 || response.status === 403) {
        // User has no stories yet, or endpoint doesn't exist - show empty state
        setStories([]);
      } else {
        throw new Error('Failed to load stories');
      }
    } catch (error) {
      // On any error, show empty state instead of error message
      console.log('Error loading stories (showing empty state):', error);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = (storyId) => {
    navigate(`/myworks/${storyId}`);
  };

  const handleCreateNew = () => {
    navigate('/create-story');
  };

  const handleViewPublic = (storyId) => {
    navigate(`/story/${storyId}`);
  };

  // Notification styles
  const notificationStyles = {
    success: 'bg-green-50 border-green-400 text-green-800',
    error: 'bg-red-50 border-red-400 text-red-800',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    info: 'bg-blue-50 border-blue-400 text-blue-800'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Banner */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 border-l-4 rounded-lg shadow-lg ${notificationStyles[notification.type]}`}>
          <div className="flex items-center">
            <span className="mr-2">
              {notification.type === 'success' && '✅'}
              {notification.type === 'error' && '❌'}
              {notification.type === 'warning' && '⚠️'}
              {notification.type === 'info' && 'ℹ️'}
            </span>
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/home')}
                className="text-indigo-600 hover:text-indigo-800 mb-2 flex items-center text-sm font-medium transition-colors"
              >
                ← Back to home
              </button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                📚 My Works
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and edit your stories • {stories.length} {stories.length === 1 ? 'story' : 'stories'}
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 font-medium"
            >
              <span>✨</span>
              <span>Create New Story</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {stories.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg p-12 max-w-md mx-auto">
              <div className="text-6xl mb-6">📖</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Start Your Writing Journey</h2>
              <p className="text-gray-600 mb-8">
                You haven't created any stories yet. Share your imagination with the world!
              </p>
              <button
                onClick={handleCreateNew}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium inline-flex items-center space-x-2"
              >
                <span>✨</span>
                <span>Create Your First Story</span>
              </button>
            </div>
          </div>
        ) : (
          /* Stories Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div key={story.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Story Cover */}
                <div className="aspect-[4/3] bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <div className="text-4xl mb-2">📚</div>
                    <div className="text-sm font-medium">{story.title}</div>
                  </div>
                </div>
                
                {/* Story Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {story.synopsis}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <span className="text-yellow-500">⭐</span>
                        <span className="ml-1">{story.rating || 0}</span>
                      </span>
                      <span className="flex items-center">
                        <span className="text-blue-500">📄</span>
                        <span className="ml-1">{story.chapters?.length || 0}</span>
                      </span>
                    </div>
                    <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded-full">
                      In Progress
                    </span>
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {story.genres?.slice(0, 2).map((genre, index) => (
                      <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                        {genre}
                      </span>
                    ))}
                    {story.genres?.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{story.genres.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStoryClick(story.id)}
                      className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleViewPublic(story.id)}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
