import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../config/AuthContext.js';

export default function ReadChapter() {
  const { storyId, chapterNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [story, setStory] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    loadChapterData();
  }, [storyId, chapterNumber, user]);

  const loadChapterData = async () => {
    try {
      setLoading(true);
      
      // Cargar datos de la historia (público)
      const response = await fetch(`http://localhost:8080/api/v1/stories/${storyId}`);
      if (!response.ok) throw new Error('Historia no encontrada');
      
      const storyData = await response.json();
      setStory(storyData);
      
      // Verificar si el usuario actual es el propietario de la historia
      if (user && storyData.author && storyData.author.username === user.username) {
        setIsOwner(true);
      }
      
      const chapterData = storyData.chapters.find(ch => ch.number === parseInt(chapterNumber));
      if (!chapterData) throw new Error('Capítulo no encontrado');
      
      setChapter(chapterData);
      
    } catch (error) {
      console.error('❌ Error al cargar capítulo:', error);
      alert('❌ Error al cargar el capítulo');
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (isOwner) {
      // Si es el propietario, ir al workspace privado
      navigate(`/myworks/${storyId}`);
    } else {
      // Si no es el propietario, ir a la vista pública de la historia
      navigate(`/story/${storyId}`);
    }
  };

  const handleEdit = () => {
    navigate(`/myworks/${storyId}/edit/${chapterNumber}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando capítulo...</p>
        </div>
      </div>
    );
  }

  if (!story || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Capítulo no encontrado</h2>
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100"
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
                  className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100"
                  title="Editar capítulo"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              <button className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Story Info */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded flex items-center justify-center">
              <span className="text-2xl">📖</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{story.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Publicado - {new Date().toLocaleDateString('es', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
                <span>(296 Palabras)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Chapter Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {chapter.title}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
        </div>

        {/* Chapter Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: chapter.content }}
          />
        </div>

        {/* Chapter Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>4</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>0</span>
              </button>
              <span className="text-gray-500">62 visualizaciones</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                ← Anterior
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Siguiente →
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Comentarios</h3>
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-lg font-medium mb-2">¡Sé el primero en comentar!</p>
            <p className="text-sm">Los comentarios de los lectores motivan a los escritores.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
