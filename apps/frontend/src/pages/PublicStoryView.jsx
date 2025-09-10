import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../config/AuthContext';

export default function PublicStoryView() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    loadStory();
  }, [storyId]);

  // Show notification system
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadStory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/v1/stories/${storyId}`);
      
      if (response.ok) {
        const storyData = await response.json();
        setStory(storyData);
        
        // Check ownership if user is logged in
        if (user) {
          await checkOwnership(storyData);
        }
      } else {
        throw new Error('Story not found');
      }
    } catch (error) {
      showNotification('Error loading story', 'error');
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const checkOwnership = async (storyData) => {
    try {
      // First check if the author username matches current user
      const authorUsername = storyData.author?.username;
      if (authorUsername) {
        // Extract username from email if needed (legacy compatibility)
        const cleanAuthorUsername = authorUsername.includes('@') 
          ? authorUsername.substring(0, authorUsername.indexOf('@'))
          : authorUsername;
        
        if (cleanAuthorUsername === user.username) {
          setIsOwner(true);
          return;
        }
      }

      // If no direct match, try ownership endpoint
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        const ownershipResponse = await fetch(`http://localhost:8080/api/v1/stories/${storyId}/ownership`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (ownershipResponse.ok) {
          setIsOwner(true);
        }
      }
    } catch (error) {
      // If ownership check fails, user is not owner (or not logged in)
      console.log('Ownership check failed:', error);
      setIsOwner(false);
    }
  };

  const handleReadChapter = (chapterNumber) => {
    navigate(`/read/${storyId}/${chapterNumber}`);
  };

  const handleShareStory = () => {
    const publicUrl = `${window.location.origin}/story/${storyId}`;
    navigator.clipboard.writeText(publicUrl).then(() => {
      showNotification('Story URL copied to clipboard!', 'success');
    }).catch(() => {
      showNotification('Could not copy to clipboard', 'warning');
    });
  };

  const handleShareChapter = (chapterNumber) => {
    const publicUrl = `${window.location.origin}/read/${storyId}/${chapterNumber}`;
    navigator.clipboard.writeText(publicUrl).then(() => {
      showNotification('Chapter URL copied to clipboard!', 'success');
    }).catch(() => {
      showNotification('Could not copy to clipboard', 'warning');
    });
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
          <p className="mt-4 text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Story not found</h2>
          <button 
            onClick={() => navigate('/home')}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Return to home
          </button>
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
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/home')}
            className="text-indigo-600 hover:text-indigo-800 mb-2 flex items-center text-sm font-medium transition-colors"
          >
            ← Back to home
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                📚 {story.title}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                By {story.author?.displayName || story.author?.username || story.author}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {isOwner && (
                <button 
                  onClick={() => navigate(`/myworks/${storyId}`)}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors flex items-center space-x-2"
                >
                  <span>✏️</span>
                  <span>Edit Story</span>
                </button>
              )}
              <button 
                onClick={handleShareStory}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <span>🔗</span>
                <span>Share Story</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Cover and Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Story Cover */}
              <div className="aspect-[3/4] bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <div className="text-4xl mb-2">📖</div>
                  <div className="text-sm">Preview</div>
                </div>
              </div>
              
              {/* Story Stats */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500">⭐</span>
                    <span className="ml-1 font-medium">{story.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chapters:</span>
                  <span className="font-medium">{story.chapters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">In Progress</span>
                </div>
              </div>

              {/* Genres */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Genres</h4>
                <div className="flex flex-wrap gap-1">
                  {story.genres.map((genre, index) => (
                    <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {story.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              
              {/* Synopsis */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Synopsis</h3>
                <p className="text-gray-600 leading-relaxed">
                  {story.synopsis}
                </p>
              </div>

              {/* Chapters */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Chapters</h3>
                  {isOwner && story.chapters.length > 0 && (
                    <button
                      onClick={() => navigate(`/myworks/${storyId}/new-chapter`)}
                      className="bg-indigo-500 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-600 transition-colors text-sm flex items-center space-x-1"
                    >
                      <span>+</span>
                      <span>New Chapter</span>
                    </button>
                  )}
                </div>

                {/* Chapters List */}
                <div className="space-y-4">
                  {story.chapters.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-4">📝</div>
                      <p className="text-lg font-medium mb-2">This story doesn't have chapters yet</p>
                      <p className="text-sm mb-4">The author hasn't published any chapters yet.</p>
                      {isOwner && (
                        <button
                          onClick={() => navigate(`/myworks/${storyId}/new-chapter`)}
                          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors inline-flex items-center space-x-2"
                        >
                          <span>✨</span>
                          <span>Create First Chapter</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    story.chapters.map((chapter, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-sm">≡</span>
                            </div>
                            <div>
                              <h4 
                                className="font-medium text-gray-800 hover:text-indigo-600 cursor-pointer"
                                onClick={() => handleReadChapter(chapter.number)}
                              >
                                {chapter.title}
                              </h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                <span>Published - {new Date().toLocaleDateString('en', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}</span>
                                <div className="flex items-center space-x-2">
                                  <span>⭐ 4</span>
                                  <span>💬 0</span>
                                  <span>👁️ 62</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {isOwner && (
                              <button
                                onClick={() => navigate(`/myworks/${storyId}/edit/${chapter.id}`)}
                                className="text-indigo-400 hover:text-indigo-600 p-2"
                                title="Edit chapter"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={() => handleShareChapter(chapter.number)}
                              className="text-blue-400 hover:text-blue-600 p-2"
                              title="Share chapter"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleReadChapter(chapter.number)}
                              className="text-green-400 hover:text-green-600 p-2"
                              title="Read chapter"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
