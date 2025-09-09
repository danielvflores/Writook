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

  // Guardar historia (adaptado para la entidad Story)
  const handleSave = async () => {
    // Verificar que tenemos datos mínimos
    if (!title.trim()) {
      alert('❌ Por favor, ingresa un título para tu historia');
      return;
    }
    
    if (!content.trim() || content === '<p><br></p>') {
      alert('❌ Por favor, escribe algo en tu historia');
      return;
    }

    try {
      // Preparar datos para enviar al backend (compatible con Story entity)
      const storyData = {
        title: title.trim(),
        synopsis: "MOCK", // TinyMCE content se mapea a synopsis
        author: {
          username: "current_user", // TODO: Obtener del contexto de auth
          displayName: "Usuario Actual",
          bio: "Escritor en Writook",
          profilePictureUrl: null
        },
        rating: 0.0, // Historia nueva empieza en 0
        genres: ["Sin categoría"], // TODO: Permitir selección
        tags: ["Borrador"], // TODO: Permitir selección
        chapters: [{
          title: "Capítulo 1",
          content: content,
          number: 1
        }],
        id: null // El backend asignará el ID
      };

      console.log('📤 Enviando historia al backend:', storyData);
      
      // TODO: Hacer llamada real al API
      // const response = await fetch('/api/v1/stories', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(storyData)
      // });
      
      alert('✅ ¡Historia guardada correctamente! 📚');
      
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      alert('❌ Error al guardar la historia. Inténtalo de nuevo.');
    }
  };

  // Función para insertar texto rápido
  const insertQuickText = (text) => {
    if (editorRef.current) {
      editorRef.current.insertContent(text);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header estilo Wattpad */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ✍️ Editor de Historias
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Escribe tu próxima gran historia
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                📊 {wordCount} palabras
              </div>
              <button
                onClick={handleSave}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200 font-medium"
              >
                💾 Guardar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => insertQuickText('<p><strong>Capítulo 1</strong></p><p>')}
            className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
          >
            📚 Nuevo Capítulo
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
          
          {/* Título de la historia */}
          <div className="p-6 border-b border-gray-100">
            <input
              type="text"
              placeholder="Título de tu historia..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-bold text-gray-800 placeholder-gray-400 border-none outline-none resize-none bg-transparent"
            />
          </div>

          {/* Editor principal */}
          <div className="p-6">
            <Editor
              apiKey='qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc' // API Key gratuita para desarrollo
              onInit={(evt, editor) => editorRef.current = editor}
              value={content}
              onEditorChange={handleEditorChange}
              init={editorConfig}
            />
          </div>
        </div>

        {/* Stats Panel estilo Wattpad */}
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
                <div className="text-green-600 font-bold text-xl">Borrador</div>
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

        {/* Tips para escritores */}
        <div className="mt-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6">
          <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
            💡 Tips para escritores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-purple-800">
            <div>• Escribe regularmente, aunque sean 200 palabras</div>
            <div>• No edites mientras escribes el primer borrador</div>
            <div>• Dale personalidad única a tus personajes</div>
            <div>• Termina capítulos con cliffhangers</div>
            <div>• Usa diálogos para mostrar, no contar</div>
            <div>• Describe usando los 5 sentidos</div>
          </div>
        </div>
      </div>
    </div>
  );
}
