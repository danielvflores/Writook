import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import useAuth from '../config/AuthContext.jsx';

export default function ChapterEditor() {
  const { storyId, chapterId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [storyTitle, setStoryTitle] = useState('');
  const [notification, setNotification] = useState(null);
  const editorRef = useRef(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      showNotification('Please log in to edit chapters', 'error');
      navigate('/login');
      return;
    }
    
    loadChapterData();
  }, [storyId, chapterId, user, authLoading]);

  const loadChapterData = async () => {
    try {
      setLoading(true);
      
      // GET DATA WITH AUTHORIZATION AND OWNERSHIP VERIFICATION
      const storyResponse = await fetch(`http://localhost:8080/api/v1/stories/${storyId}/ownership`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (storyResponse.ok) {
        const storyData = await storyResponse.json();
        setStoryTitle(storyData.title);
        
        const chapter = storyData.chapters.find(ch => ch.number === parseInt(chapterId));
        if (chapter) {
          setTitle(chapter.title);
          setContent(chapter.content);
          const textContent = chapter.content.replace(/<[^>]*>/g, '');
          const words = textContent.trim().split(/\s+/).length;
          setWordCount(textContent.trim() === '' ? 0 : words);
        } else {
          showNotification('Chapter not found', 'error');
          navigate(`/myworks/${storyId}`);
        }
      } else {
        if (storyResponse.status === 403) {
          showNotification('You do not have permission to edit this story', 'error');
        } else if (storyResponse.status === 404) {
          showNotification('Story not found', 'error');
        } else {
          showNotification('Error loading story', 'error');
        }
        navigate('/home');
      }
      
    } catch (error) {
      showNotification('Connection error loading chapter', 'error');
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  // TinyMCE Properties
  const editorConfig = {
    height: 500,
    menubar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | formatselect | ' +
      'bold italic backcolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | help',
    content_style: `
      body { 
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
        font-size: 16px; 
        line-height: 1.6; 
        color: #374151;
        max-width: none;
        margin: 0;
        padding: 20px;
      }
      h1, h2, h3 { color: #1f2937; }
      p { margin-bottom: 1em; }
    `,
    skin: 'oxide',
    content_css: 'default',
    branding: false,
    promotion: false,
    statusbar: false,
    tracking: false,
    setup: (editor) => {
      editor.on('keyup', () => {
        const content = editor.getContent({ format: 'text' });
        const words = content.trim().split(/\s+/).length;
        setWordCount(content.trim() === '' ? 0 : words);
      });
    }
  };

  const handleEditorChange = (content, editor) => {
    setContent(content);
    const textContent = editor.getContent({ format: 'text' });
    const words = textContent.trim().split(/\s+/).length;
    setWordCount(textContent.trim() === '' ? 0 : words);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      showNotification('Please enter a chapter title', 'warning');
      return;
    }
    
    if (!content.trim() || content === '<p><br></p>') {
      showNotification('Please write some content for the chapter', 'warning');
      return;
    }

    try {
      const chapterData = {
        title: title.trim(),
        content: content,
        number: parseInt(chapterId)
      };

      const response = await fetch(`http://localhost:8080/api/v1/stories/${storyId}/edit/${chapterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(chapterData)
      });

      if (response.ok) {
        showNotification('Chapter saved successfully! 📚', 'success');
      } else {
        throw new Error('Server response error');
      }
      
    } catch (error) {
      showNotification('Error saving chapter. Please try again.', 'error');
    }
  };

  const handleBack = () => {
    navigate(`/myworks/${storyId}`);
  };

  const insertQuickText = (text) => {
    if (editorRef.current) {
      editorRef.current.insertContent(text);
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chapter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NotificationBanner />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
          >
            ← Back to "{storyTitle}"
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Chapter Editor</h1>
          <p className="text-gray-600">Editing Chapter {chapterId}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Chapter title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-semibold border-b-2 border-gray-200 focus:border-indigo-500 outline-none pb-2"
            />
          </div>

          <div className="mb-6">
            <Editor
              apiKey='qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc'
              onInit={(evt, editor) => editorRef.current = editor}
              value={content}
              onEditorChange={handleEditorChange}
              init={editorConfig}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Words: {wordCount} | Reading time: ~{Math.ceil(wordCount / 200)} min
            </div>
            <button
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              💾 Save Chapter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
