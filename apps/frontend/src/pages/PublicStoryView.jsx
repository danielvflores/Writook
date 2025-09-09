import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PublicStoryView() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStory();
  }, [storyId]);

  const loadStory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/v1/stories/${storyId}`);
      
      if (response.ok) {
        const storyData = await response.json();
        setStory(storyData);
      } else {
        throw new Error('Historia no encontrada');
      }
    } catch (error) {
      console.error('❌ Error al cargar historia:', error);
      alert('❌ Error al cargar la historia');
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const handleReadChapter = (chapterNumber) => {
    navigate(`/read/${storyId}/${chapterNumber}`);
  };

  const handleShareStory = () => {
    const publicUrl = `${window.location.origin}/story/${storyId}`;
    navigator.clipboard.writeText(publicUrl).then(() => {
      alert('✅ URL copiado al portapapeles!\n' + publicUrl);
    }).catch(() => {
      prompt('Copia esta URL para compartir la historia:', publicUrl);
    });
  };

  const handleShareChapter = (chapterNumber) => {
    const publicUrl = `${window.location.origin}/read/${storyId}/${chapterNumber}`;
    navigator.clipboard.writeText(publicUrl).then(() => {
      alert('✅ URL del capítulo copiado!\n' + publicUrl);
    }).catch(() => {
      prompt('Copia esta URL para compartir el capítulo:', publicUrl);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando historia...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Historia no encontrada</h2>
          <button 
            onClick={() => navigate('/home')}
            className="text-purple-600 hover:text-purple-800"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/home')}
            className="text-purple-600 hover:text-purple-800 mb-2 flex items-center text-sm"
          >
            ← Volver al inicio
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                📚 {story.title}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Por {story.author.displayName}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleShareStory}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <span>🔗</span>
                <span>Compartir Historia</span>
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
              <div className="aspect-[3/4] bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <div className="text-4xl mb-2">📖</div>
                  <div className="text-sm">Vista previa</div>
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
                  <span className="text-gray-600">Capítulos:</span>
                  <span className="font-medium">{story.chapters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="text-green-600 font-medium">En Progreso</span>
                </div>
              </div>

              {/* Genres */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Géneros</h4>
                <div className="flex flex-wrap gap-1">
                  {story.genres.map((genre, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
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
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Sinopsis</h3>
                <p className="text-gray-600 leading-relaxed">
                  {story.synopsis}
                </p>
              </div>

              {/* Chapters */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Capítulos</h3>
                </div>

                {/* Chapters List */}
                <div className="space-y-4">
                  {story.chapters.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-4">📝</div>
                      <p className="text-lg font-medium mb-2">Esta historia aún no tiene capítulos</p>
                      <p className="text-sm">El autor aún no ha publicado ningún capítulo.</p>
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
                                className="font-medium text-gray-800 hover:text-purple-600 cursor-pointer"
                                onClick={() => handleReadChapter(chapter.number)}
                              >
                                {chapter.title}
                              </h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                <span>Publicado - {new Date().toLocaleDateString('es', { 
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
                            <button
                              onClick={() => handleShareChapter(chapter.number)}
                              className="text-blue-400 hover:text-blue-600 p-2"
                              title="Compartir capítulo"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleReadChapter(chapter.number)}
                              className="text-green-400 hover:text-green-600 p-2"
                              title="Leer capítulo"
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
