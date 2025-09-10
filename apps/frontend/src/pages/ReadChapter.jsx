import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../config/AuthContext.jsx';

export default function ReadChapter() {
  const { storyId, chapterNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [story, setStory] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadChapterData();
  }, [storyId, chapterNumber, user]);

  // Show notification system
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadChapterData = async () => {
    try {
      setLoading(true);
      
      // Load story data (public endpoint)
      const response = await fetch(`http://localhost:8080/api/v1/stories/${storyId}`);
      if (!response.ok) throw new Error('Story not found');
      
      const storyData = await response.json();
      setStory(storyData);
      
      // Check if current user is the story owner
      if (user && storyData.author && storyData.author.username === user.username) {
        setIsOwner(true);
      }
      
      const chapterData = storyData.chapters.find(ch => ch.number === parseInt(chapterNumber));
      if (!chapterData) throw new Error('Chapter not found');
      
      setChapter(chapterData);
      
    } catch (error) {
      showNotification('Error loading chapter', 'error');
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (isOwner) {
      // If owner, go to private workspace
      navigate(`/myworks/${storyId}`);
    } else {
      // If not owner, go to public story view
      navigate(`/story/${storyId}`);
    }
  };

  const handleEdit = () => {
    navigate(`/myworks/${storyId}/edit/${chapterNumber}`);
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
          <p className="mt-4 text-gray-600">Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (!story || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Chapter not found</h2>
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
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <div className="text-sm text-gray-500">
                  {story.title}
                </div>
                <div className="font-medium text-gray-800">
                  {chapter.title}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {isOwner && (
                <button
                  onClick={handleEdit}
                  className="text-gray-600 hover:text-indigo-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Edit chapter"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Story Info */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📖</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{story.title}</h1>
              <p className="text-lg font-medium text-indigo-600 mt-1">{chapter.title}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                <span>Chapter {chapterNumber}</span>
                <span>•</span>
                <span>Published {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Chapter Title */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {chapter.title}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded mx-auto"></div>
          </div>

          {/* Chapter Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-gray-800 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: chapter.content }}
            />
          </div>

          {/* Chapter Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="font-medium">Like</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="font-medium">Comment</span>
                </button>
                <span className="text-gray-500 text-sm">{story.views || 0} views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Comments</h3>
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-lg font-medium mb-2">Be the first to comment!</p>
            <p className="text-sm">Reader feedback motivates writers to continue their stories.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
