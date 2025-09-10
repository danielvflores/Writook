import { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function EditorTest() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const editorRef = useRef(null);

  // Configuración de TinyMCE estilo Wattpad
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

  // Manejar cambios en el contenido
  const handleEditorChange = (content, editor) => {
    setContent(content);
    const textContent = editor.getContent({ format: 'text' });
    const words = textContent.trim().split(/\s+/).length;
    setWordCount(textContent.trim() === '' ? 0 : words);
  };

  // Save story (adapted for Story entity)
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Show notification system
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSave = async () => {
    // Verify minimum required data
    if (!title.trim()) {
      showNotification('Please enter a title for your story', 'warning');
      return;
    }
    
    if (!content.trim() || content === '<p><br></p>') {
      showNotification('Please write some content for your story', 'warning');
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare data for backend (compatible with Story entity)
      const storyData = {
        title: title.trim(),
        synopsis: "Test story from editor", // TinyMCE content mapped to synopsis
        author: {
          username: "current_user", // TODO: Get from auth context
          displayName: "Current User",
          bio: "Writer on Writook",
          profilePictureUrl: null
        },
        rating: 0.0, // New story starts at 0
        genres: ["Uncategorized"], // TODO: Allow selection
        tags: ["Draft"], // TODO: Allow selection
        chapters: [{
          title: "Chapter 1",
          content: content,
          number: 1
        }],
        id: null // Backend will assign ID
      };
      
      // TODO: Make real API call
      // const response = await fetch('/api/v1/stories', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(storyData)
      // });
      
      showNotification('Story saved successfully!', 'success');
      
    } catch (error) {
      showNotification('Error saving story. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para insertar texto rápido
  const insertQuickText = (text) => {
    if (editorRef.current) {
      editorRef.current.insertContent(text);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Banner */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 border-l-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-50 border-green-400 text-green-800' :
          notification.type === 'error' ? 'bg-red-50 border-red-400 text-red-800' :
          notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-800' :
          'bg-blue-50 border-blue-400 text-blue-800'
        }`}>
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
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                ✍️ Story Editor
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Write your next great story
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                📊 {wordCount} words
              </div>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '⏳ Saving...' : '💾 Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => insertQuickText('<p><strong>Chapter 1</strong></p><p>')}
            className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-200 transition-colors"
          >
            📚 New Chapter
          </button>
          <button
            onClick={() => insertQuickText('<p>***</p><p>')}
            className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
          >
            ✨ Separator
          </button>
          <button
            onClick={() => insertQuickText('<p><em>Author note: </em></p><p>')}
            className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            📝 Author Note
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="max-w-5xl mx-auto px-4 pb-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          
          {/* Story title */}
          <div className="p-6 border-b border-gray-100">
            <input
              type="text"
              placeholder="Title of your story..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-bold text-gray-800 placeholder-gray-400 border-none outline-none resize-none bg-transparent"
            />
          </div>

          {/* Main editor */}
          <div className="p-6">
            <Editor
              apiKey='qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc' // Free API Key for development
              onInit={(evt, editor) => editorRef.current = editor}
              value={content}
              onEditorChange={handleEditorChange}
              init={editorConfig}
            />
          </div>
        </div>

        {/* Stats Panel */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📝</span>
              <div>
                <div className="font-semibold text-gray-800">Words</div>
                <div className="text-indigo-600 font-bold text-xl">{wordCount}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⏱️</span>
              <div>
                <div className="font-semibold text-gray-800">Reading time</div>
                <div className="text-blue-600 font-bold text-xl">~{Math.ceil(wordCount / 200)} min</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📚</span>
              <div>
                <div className="font-semibold text-gray-800">Status</div>
                <div className="text-green-600 font-bold text-xl">Draft</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📄</span>
              <div>
                <div className="font-semibold text-gray-800">Pages</div>
                <div className="text-gray-600 font-bold text-xl">~{Math.ceil(wordCount / 250)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Writing tips */}
        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-indigo-900 mb-3 flex items-center">
            💡 Writing tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-indigo-800">
            <div>• Write regularly, even if just 200 words</div>
            <div>• Don't edit while writing the first draft</div>
            <div>• Give unique personality to your characters</div>
            <div>• End chapters with cliffhangers</div>
            <div>• Use dialogue to show, not tell</div>
            <div>• Describe using all 5 senses</div>
          </div>
        </div>
      </div>
    </div>
  );
}
