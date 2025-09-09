package com.danielvflores.writook.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.danielvflores.writook.dto.AuthorDTO;
import com.danielvflores.writook.model.Chapter;
import com.danielvflores.writook.model.Story;
import com.danielvflores.writook.utility.TokenJWTUtility;

@Service
public class StoryService {
    
    // Business logic related to users will be implemented here
    // MOCK STRUCTURES FOR DEVELOPMENT PURPOSES
    private final List<Story> stories = new ArrayList<>();
    private Long currentId = 1L;

    public StoryService() {
        // MY MOCK DATA IS PROVISIONAL FOR DEVELOPMENT PURPOSES
        // THIS MOCK DATA WILL BE REMOVED ONCE CONNECTED TO A REAL DATABASE
        stories.add(new Story(
            "My First Story", 
            "Once upon a time...", 
            new AuthorDTO("prueba1", "Prueba Usuario 1", "Fantasy writer and dreamer", "https://avatar.url/prueba1.jpg"), 
            4.5, 
            List.of("Fantasy"), 
            List.of("Magic", "Adventure"), 
            List.of(new Chapter("The Beginning", "In a land far away, magic was real...", 1)), 
            1L
        ));
        stories.add(new Story(
            "A Day in the Life", 
            "It was a sunny day...", 
            new AuthorDTO("danielvflores111", "Daniel V Flores", "Everyday stories enthusiast", "https://avatar.url/daniel.jpg"), 
            4.0, 
            List.of("Slice of Life"), 
            List.of("Everyday", "Realism"), 
            List.of(new Chapter("Morning Routine", "The alarm clock rang at 7 AM...", 1)), 
            2L
        ));
        stories.add(new Story(
            "The Mystery", 
            "The door creaked open...", 
            new AuthorDTO("prueba1", "Prueba Usuario 1", "Mystery and thriller writer", "https://avatar.url/prueba1.jpg"), 
            5.0, 
            List.of("Mystery"), 
            List.of("Suspense", "Thriller"), 
            List.of(new Chapter("The Discovery", "The door creaked open revealing secrets...", 1)), 
            3L
        ));
        stories.add(new Story(
            "Editar Detalles de la Historia", 
            "Aquí que lo perdió todo...", 
            new AuthorDTO("prueba1", "Prueba Usuario 1", "Story creator", "https://avatar.url/prueba1.jpg"), 
            0.0, 
            List.of("En Progreso"), 
            List.of(), 
            List.of(new Chapter("Cap 1", "Published 9 sept 2025", 1)), 
            4L
        ));
        currentId = 5L;
    }

    public List<Story> getAllStories() {
        return stories;
    }

    public Story getStoryById(Long id) {
        return stories.stream()
                .filter(story -> story.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public Story getStoryById(Long id, String authHeader) {
        Story story = stories.stream()
                .filter(s -> s.getId().equals(id))
                .findFirst()
                .orElse(null);
        
        if (story == null) {
            return null; // Historia no encontrada
        }
        
        // Para lectura pública, no necesita autenticación
        // Para edición (detectada por el contexto), necesita ser el autor
        // Por ahora, retornamos la historia (la verificación de edición se hace en endpoints específicos)
        return story;
    }

    // Método para verificar propiedad (usado en /myworks)
    public Story getStoryWithOwnershipCheck(Long id, String authHeader) {
        // Verificar que el token esté presente
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token de autorización requerido");
        }
        
        // Extraer el token sin "Bearer "
        String token = authHeader.substring(7);
        
        // Validar y extraer usuario del token
        if (!TokenJWTUtility.validateToken(token)) {
            throw new RuntimeException("Token inválido");
        }
        
        String userFromToken = TokenJWTUtility.getUsernameFromToken(token);
        if (userFromToken == null) {
            throw new RuntimeException("No se pudo extraer usuario del token");
        }
        
        // Buscar la historia
        Story story = getStoryById(id);
        if (story == null) {
            throw new RuntimeException("Historia no encontrada");
        }
        
        // Verificar que el usuario del token sea el autor de la historia
        if (!story.getAuthor().getUsername().equals(userFromToken)) {
            throw new RuntimeException("No tienes permiso para acceder a este espacio de trabajo");
        }
        
        return story;
    }

    public Story createStory(Story story) {
        Story storyWithId = new Story(
            story.getTitle(),
            story.getSynopsis(),
            story.getAuthor(),
            story.getRating(),
            story.getGenres(),
            story.getTags(),
            story.getChapters(),
            currentId++
        );
        stories.add(storyWithId);
        return storyWithId;
    }

    public Story updateStory(Long id, Story updatedStory) {
        for (int i = 0; i < stories.size(); i++) {
            if (stories.get(i).getId().equals(id)) {
                Story updatedStoryWithId = new Story(
                    updatedStory.getTitle(),
                    updatedStory.getSynopsis(),
                    updatedStory.getAuthor(),
                    updatedStory.getRating(),
                    updatedStory.getGenres(),
                    updatedStory.getTags(),
                    updatedStory.getChapters(),
                    id
                );
                stories.set(i, updatedStoryWithId);
                return updatedStoryWithId;
            }
        }
        return null;
    }

    public boolean deleteStory(Long id) {
        return stories.removeIf(story -> story.getId().equals(id));
    }

    public List<Story> getStoriesByAuthorUsername(String username) {
        List<Story> result = new ArrayList<>();
        for (Story story : stories) {
            if (story.getAuthor().getUsername().equals(username)) {
                result.add(story);
            }
        }
        return result;
    }

    public List<Story> getStoriesByGenre(String genre) {
        List<Story> result = new ArrayList<>();
        for (Story story : stories) {
            if (story.getGenres().contains(genre)) {
                result.add(story);
            }
        }
        return result;
    }

    public List<Story> getStoriesByTag(String tag) {
        List<Story> result = new ArrayList<>();
        for (Story story : stories) {
            if (story.getTags().contains(tag)) {
                result.add(story);
            }
        }
        return result;
    }

    // Actualizar un capítulo específico de una historia
    public Chapter updateChapter(Long storyId, Long chapterId, Chapter updatedChapter, String authHeader) {
        // Verificar que el token esté presente
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token de autorización requerido");
        }
        
        // Extraer el token sin "Bearer "
        String token = authHeader.substring(7);
        
        // Validar y extraer usuario del token
        if (!TokenJWTUtility.validateToken(token)) {
            throw new RuntimeException("Token inválido");
        }
        
        String userFromToken = TokenJWTUtility.getUsernameFromToken(token);
        if (userFromToken == null) {
            throw new RuntimeException("No se pudo extraer usuario del token");
        }
        
        for (int i = 0; i < stories.size(); i++) {
            Story story = stories.get(i);
            if (story.getId().equals(storyId)) {
                // Verificar que el usuario del token sea el autor de la historia
                if (!story.getAuthor().getUsername().equals(userFromToken)) {
                    throw new RuntimeException("No tienes permiso para editar esta historia");
                }
                
                // Buscar el capítulo en la lista de capítulos
                List<Chapter> chapters = new ArrayList<>(story.getChapters());
                for (int j = 0; j < chapters.size(); j++) {
                    Chapter chapter = chapters.get(j);
                    // Asumiendo que chapterId corresponde al number del capítulo
                    if (chapter.getNumber() == chapterId.intValue()) {
                        // Crear nuevo capítulo inmutable con los datos actualizados
                        Chapter updatedChapterImmutable = new Chapter(
                            updatedChapter.getTitle(),
                            updatedChapter.getContent(),
                            chapter.getNumber() // Mantener el número original
                        );
                        
                        // Reemplazar el capítulo en la lista
                        chapters.set(j, updatedChapterImmutable);
                        
                        // Crear nueva historia inmutable con la lista de capítulos actualizada
                        Story updatedStory = new Story(
                            story.getTitle(),
                            story.getSynopsis(),
                            story.getAuthor(),
                            story.getRating(),
                            story.getGenres(),
                            story.getTags(),
                            chapters,
                            story.getId()
                        );
                        
                        // Reemplazar la historia en la lista
                        stories.set(i, updatedStory);
                        return updatedChapterImmutable;
                    }
                }
                break;
            }
        }
        throw new RuntimeException("Historia o capítulo no encontrado");
    }

    public List<Story> getTopRatedStories(int limit) {
        return stories.stream()
                .sorted((s1, s2) -> Double.compare(s2.getRating(), s1.getRating()))
                .limit(limit)
                .toList();
    }

    public List<Story> searchStories(String query) {
        String lowerQuery = query.toLowerCase();
        List<Story> result = new ArrayList<>();
        for (Story story : stories) {
            if (story.getTitle().toLowerCase().contains(lowerQuery) || 
                story.getSynopsis().toLowerCase().contains(lowerQuery) || 
                story.getAuthor().getDisplayName().toLowerCase().contains(lowerQuery)) {
                result.add(story);
            }
        }
        return result;
    }
}
