import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../config/AuthContext.js';

export default function MyStoryDetails() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

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
        const errorMessage = await response.text();
        console.error('❌ Error del servidor:', errorMessage);
        
        if (response.status === 403) {
          // Si no tiene permisos, redirigir a la vista pública sin mostrar alertas
          console.log('🔄 Redirigiendo a vista pública de la historia');
          navigate(`/story/${storyId}`);
          return;
        } else if (response.status === 404) {
          alert('❌ Historia no encontrada');
          navigate('/home');
        } else if (response.status === 401) {
          alert('❌ Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          navigate('/home');
        } else {
          alert('❌ Error: ' + errorMessage);
          navigate('/home');
        }
      }
    } catch (error) {
      console.error('❌ Error al cargar historia:', error);
      alert('❌ Error de conexión al cargar la historia');
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const handleNewChapter = () => {
    navigate(`/create-chapter/${storyId}`);
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
        alert('✅ URL copiado al portapapeles!\n' + publicUrl);
      }).catch(() => {
        // Fallback si no funciona el clipboard
        prompt('Copia esta URL para compartir tu historia:', publicUrl);
      });
    }
  };

  const handleShareChapter = (chapterNumber) => {
    if (user && story) {
      const publicUrl = `${window.location.origin}/read/${storyId}/${chapterNumber}`;
      navigator.clipboard.writeText(publicUrl).then(() => {
        alert('✅ URL del capítulo copiado!\n' + publicUrl);
      }).catch(() => {
        prompt('Copia esta URL para compartir el capítulo:', publicUrl);
      });
    }
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
            ← Volver a Mis Trabajos
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                📚 Editar Detalles de la Historia
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {story.title}
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
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                Cancelar
              </button>
              <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                Guardar
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
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500">⭐</span>
                    <span className="ml-1">{story.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capítulos:</span>
                  <span>{story.chapters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="text-green-600">En Progreso</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button className="py-4 text-sm font-medium text-purple-600 border-b-2 border-purple-600">
                    Detalles de la historia
                  </button>
                  <button className="py-4 text-sm font-medium text-orange-500 border-b-2 border-orange-500">
                    Tabla de Contenidos
                  </button>
                  <button className="py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                    Story Notes
                    <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs">New</span>
                  </button>
                </nav>
              </div>

              {/* Chapters Section */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Capítulos</h3>
                  <button
                    onClick={handleNewChapter}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
                  >
                    + Parte Nueva
                  </button>
                </div>

                {/* Chapters List */}
                <div className="space-y-4">
                  {story.chapters.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-4">📝</div>
                      <p className="text-lg font-medium mb-2">¡Es hora de empezar a escribir!</p>
                      <p className="text-sm mb-4">Agrega tu primer capítulo para que los lectores puedan disfrutar tu historia.</p>
                      <button
                        onClick={handleNewChapter}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        ✨ Escribir Primer Capítulo
                      </button>
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
                              onClick={() => handleEditChapter(chapter.number)}
                              className="text-gray-400 hover:text-gray-600 p-2"
                              title="Editar capítulo"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
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
