import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../config/AuthContext.js';

export default function CreateStory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    synopsis: '',
    genres: [],
    tags: []
  });
  const [loading, setLoading] = useState(false);

  // Géneros disponibles (puedes expandir esta lista)
  const availableGenres = [
    'Fantasía', 'Romance', 'Aventura', 'Misterio', 'Ciencia Ficción', 
    'Horror', 'Drama', 'Comedia', 'Slice of Life', 'Histórico'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenreToggle = (genre) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('❌ Por favor, ingresa un título para tu historia');
      return;
    }
    
    if (!formData.synopsis.trim()) {
      alert('❌ Por favor, escribe una sinopsis');
      return;
    }

    if (formData.genres.length === 0) {
      alert('❌ Por favor, selecciona al menos un género');
      return;
    }

    setLoading(true);
    try {
      // Debug: verificar token
      const token = localStorage.getItem('authToken');
      console.log('🔑 Token encontrado:', token ? 'Sí' : 'No');
      console.log('👤 Usuario actual:', user);
      
      if (!token) {
        alert('❌ No estás autenticado. Por favor inicia sesión.');
        navigate('/login');
        return;
      }

      const storyData = {
        title: formData.title.trim(),
        synopsis: formData.synopsis.trim(),
        author: {
          username: user.username,
          displayName: user.displayName || user.username,
          bio: user.bio || "Escritor en Writook",
          profilePictureUrl: user.profilePictureUrl || null
        },
        rating: 0.0,
        genres: formData.genres,
        tags: formData.tags.length > 0 ? formData.tags : ["Nueva"],
        chapters: [], // Sin capítulos inicialmente
        id: null
      };

      const response = await fetch('http://localhost:8080/api/v1/stories', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(storyData)
      });

      if (response.ok) {
        const createdStory = await response.json();
        alert('✅ ¡Historia creada exitosamente! 📚');
        navigate(`/myworks/${createdStory.id}`);
      } else {
        throw new Error('Error al crear la historia');
      }
      
    } catch (error) {
      console.error('❌ Error:', error);
      alert('❌ Error al crear la historia. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ✍️ Crear Nueva Historia
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Comparte tu imaginación con el mundo
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg overflow-hidden">
          
          {/* Título */}
          <div className="p-6 border-b border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título de la Historia *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ej: El Reino de los Dragones Perdidos"
              className="w-full text-xl font-semibold text-gray-800 border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
              maxLength="100"
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.title.length}/100 caracteres
            </div>
          </div>

          {/* Sinopsis */}
          <div className="p-6 border-b border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sinopsis *
            </label>
            <textarea
              name="synopsis"
              value={formData.synopsis}
              onChange={handleInputChange}
              placeholder="Describe de qué trata tu historia. ¿Qué aventuras esperan a tus lectores?"
              className="w-full h-32 text-gray-800 border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors resize-none"
              maxLength="500"
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.synopsis.length}/500 caracteres
            </div>
          </div>

          {/* Géneros */}
          <div className="p-6 border-b border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Géneros * (selecciona hasta 3)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableGenres.map(genre => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => handleGenreToggle(genre)}
                  disabled={!formData.genres.includes(genre) && formData.genres.length >= 3}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    formData.genres.includes(genre)
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${(!formData.genres.includes(genre) && formData.genres.length >= 3) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {genre}
                </button>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Seleccionados: {formData.genres.length}/3
            </div>
          </div>

          {/* Tags */}
          <div className="p-6 border-b border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags (opcional)
            </label>
            <input
              type="text"
              onChange={handleTagsChange}
              placeholder="Ej: magia, dragones, amistad (separados por comas)"
              className="w-full text-gray-800 border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
            />
            <div className="text-xs text-gray-500 mt-1">
              Separa los tags con comas. Ayudan a los lectores a encontrar tu historia.
            </div>
          </div>

          {/* Submit */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50"
              >
                {loading ? '⏳ Creando...' : '✨ Crear Historia'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
