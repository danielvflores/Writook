import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../config/AuthContext.js';

export default function MyStoryDetails() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    loadStory();
  }, [storyId]);

  const loadStory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/v1/stories/${storyId}/ownership`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.ok) {
        const storyData = await response.json();
        setStory(storyData);
      } else {
        if (response.status === 403) {
          navigate(`/story/${storyId}`);
          return;
        } else if (response.status === 404) {
          showNotification('Story not found', 'error');
          navigate('/home');
        } else if (response.status === 401) {
          showNotification('Your session has expired. Please log in again.', 'error');
          navigate('/home');
        } else {
          showNotification('Error loading story', 'error');
          navigate('/home');
        }
      }
    } catch (error) {
      showNotification('Connection error loading story', 'error');
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const handleEditChapter = (chapterNumber) => {
    navigate(`/myworks/${storyId}/edit/${chapterNumber}`);
  };

  const handleReadChapter = (chapterNumber) => {
    navigate(`/read/${storyId}/${chapterNumber}`);
  };

  const handleShareStory = () => {
    if (user && story) {
      const publicUrl = `${window.location.origin}/story/${storyId}`;
      navigator.clipboard.writeText(publicUrl).then(() => {
        showNotification('Story URL copied to clipboard! 📋', 'success');
      }).catch(() => {
        prompt('Copy this URL to share your story:', publicUrl);
      });
    }
  };

  const handleShareChapter = (chapterNumber) => {
    if (user && story) {
      const publicUrl = `${window.location.origin}/read/${storyId}/${chapterNumber}`;
      navigator.clipboard.writeText(publicUrl).then(() => {
        showNotification('Chapter URL copied to clipboard! 📋', 'success');
      }).catch(() => {
        prompt('Copy this URL to share the chapter:', publicUrl);
      });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Story not found</h2>
          <button 
            onClick={() => navigate('/home')}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Return to home
          </button>
        </div>
      </div>
    );
  }

  const handleNewChapter = () => {
    navigate(`/myworks/${storyId}/new-chapter`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NotificationBanner />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/myworks')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
          >
            ← Back to My Works
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{story.title}</h1>
              <p className="text-gray-600">by {story.author?.displayName || story.author?.username || story.author}</p>
            </div>
            <button 
              onClick={handleShareStory}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <span>🔗</span>
              <span>Share Story</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="aspect-[3/4] bg-gradient-to-br from-indigo-200 to-blue-200 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <div className="text-4xl mb-2">📖</div>
                  <div className="text-sm">Story Cover</div>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Chapters:</span>
                  <span className="font-medium">{story.chapters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Views:</span>
                  <span className="font-medium">{story.views || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Genres:</span>
                  <span className="font-medium">{story.genres.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Chapters</h2>
                <button
                  onClick={handleNewChapter}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                >
                  + New Chapter
                </button>
              </div>

              {story.chapters.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-lg font-medium mb-2">Time to start writing!</p>
                  <p className="text-sm mb-4">Add your first chapter so readers can enjoy your story.</p>
                  <button
                    onClick={handleNewChapter}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
                  >
                    ✨ Write First Chapter
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {story.chapters.map((chapter, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 
                            className="font-medium text-gray-800 hover:text-indigo-600 cursor-pointer"
                            onClick={() => handleReadChapter(chapter.number)}
                          >
                            Chapter {chapter.number}: {chapter.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Last updated: {new Date().toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleShareChapter(chapter.number)}
                            className="text-blue-500 hover:text-blue-700 p-2"
                            title="Share chapter"
                          >
                            🔗
                          </button>
                          <button
                            onClick={() => handleEditChapter(chapter.number)}
                            className="text-gray-500 hover:text-gray-700 p-2"
                            title="Edit chapter"
                          >
                            ✏️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
