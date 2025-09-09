import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';

export default function CreateChapter() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);

  // Configuración de TinyMCE
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
      alert('❌ Por favor, ingresa un título para el capítulo');
      return;
    }
    
    if (!content.trim() || content === '<p><br></p>') {
      alert('❌ Por favor, escribe algo en el capítulo');
      return;
    }

    setLoading(true);
    try {
      // Primero, obtener la historia para saber cuántos capítulos tiene
      const storyResponse = await fetch(`http://localhost:8080/api/v1/stories/${storyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!storyResponse.ok) throw new Error('No se pudo cargar la historia');
      
      const storyData = await storyResponse.json();
      const nextChapterNumber = storyData.chapters.length + 1;

      const chapterData = {
        title: title.trim(),
        content: content,
        number: nextChapterNumber
      };

      // Crear el capítulo agregándolo a la historia
      const updatedChapters = [...storyData.chapters, chapterData];
      const updatedStory = {
        ...storyData,
        chapters: updatedChapters
      };

      const response = await fetch(`http://localhost:8080/api/v1/stories/${storyId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(updatedStory)
      });

      if (response.ok) {
        alert('✅ ¡Capítulo creado correctamente! 📚');
        navigate(`/myworks/${storyId}`);
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
      
    } catch (error) {
      console.error('❌ Error al crear capítulo:', error);
      alert('❌ Error al crear el capítulo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/myworks/${storyId}`);
  };

  const insertQuickText = (text) => {
    if (editorRef.current) {
      editorRef.current.insertContent(text);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={handleCancel}
                className="text-purple-600 hover:text-purple-800 mb-2 flex items-center text-sm"
              >
                ← Volver a la Historia
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ✍️ Nuevo Capítulo
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Agrega un nuevo capítulo a tu historia
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                📊 {wordCount} palabras
              </div>
              <button
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50"
              >
                {loading ? '⏳ Guardando...' : '💾 Publicar Cambios'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => insertQuickText('<p><strong>---</strong></p><p>')}
            className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
          >
            📚 Separador de Escena
          </button>
          <button
            onClick={() => insertQuickText('<p>***</p><p>')}
            className="text-xs bg-pink-100 text-pink-700 px-3 py-1 rounded-full hover:bg-pink-200 transition-colors"
          >
            ✨ Separador
          </button>
          <button
            onClick={() => insertQuickText('<p><em>Nota del autor: </em></p><p>')}
            className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
          >
            📝 Nota del Autor
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="max-w-5xl mx-auto px-4 pb-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          
          {/* Título del capítulo */}
          <div className="p-6 border-b border-gray-100">
            <input
              type="text"
              placeholder="Título del capítulo..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-bold text-gray-800 placeholder-gray-400 border-none outline-none resize-none bg-transparent"
            />
          </div>

          {/* Editor principal */}
          <div className="p-6">
            <Editor
              apiKey='qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc'
              onInit={(evt, editor) => editorRef.current = editor}
              value={content}
              onEditorChange={handleEditorChange}
              init={editorConfig}
            />
          </div>
        </div>

        {/* Stats Panel */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📝</span>
              <div>
                <div className="font-semibold text-gray-800">Palabras</div>
                <div className="text-purple-600 font-bold text-xl">{wordCount}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⏱️</span>
              <div>
                <div className="font-semibold text-gray-800">Lectura</div>
                <div className="text-pink-600 font-bold text-xl">~{Math.ceil(wordCount / 200)} min</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📚</span>
              <div>
                <div className="font-semibold text-gray-800">Estado</div>
                <div className="text-green-600 font-bold text-xl">Nuevo</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📄</span>
              <div>
                <div className="font-semibold text-gray-800">Páginas</div>
                <div className="text-blue-600 font-bold text-xl">~{Math.ceil(wordCount / 250)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
