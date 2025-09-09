package com.danielvflores.writook.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.danielvflores.writook.model.Chapter;
import com.danielvflores.writook.model.Story;
import com.danielvflores.writook.utility.TokenJWTUtility;

@Service
public class StoryService {
    
    private final List<Story> stories = new ArrayList<>();
    private Long currentId = 1L; // FOR PROD DELETE THIS AND CHANGE TO USE NANOID LATER
    // TODO: Integrate with a real database instead of using in-memory list

    public StoryService() {
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
            return null;
        }

        return story;
    }

    public Story getStoryWithOwnershipCheck(Long id, String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token de autorización requerido");
        }

        String token = authHeader.substring(7);
        
        if (!TokenJWTUtility.validateToken(token)) {
            throw new RuntimeException("Token inválido");
        }
        
        String userFromToken = TokenJWTUtility.getUsernameFromToken(token);
        if (userFromToken == null) {
            throw new RuntimeException("No se pudo extraer usuario del token");
        }
        
        Story story = getStoryById(id);
        if (story == null) {
            throw new RuntimeException("Historia no encontrada");
        }
        
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

    public Chapter updateChapter(Long storyId, Long chapterId, Chapter updatedChapter, String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token de autorización requerido");
        }

        String token = authHeader.substring(7);
        
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

                if (!story.getAuthor().getUsername().equals(userFromToken)) {
                    throw new RuntimeException("No tienes permiso para editar esta historia");
                }
                
                List<Chapter> chapters = new ArrayList<>(story.getChapters());
                for (int j = 0; j < chapters.size(); j++) {
                    Chapter chapter = chapters.get(j);

                    if (chapter.getNumber() == chapterId.intValue()) {

                        // FOR IMMUTABILITY, CREATE A NEW CHAPTER INSTANCE
                        Chapter updatedChapterImmutable = new Chapter(
                            updatedChapter.getTitle(),
                            updatedChapter.getContent(),
                            chapter.getNumber()
                        );
                        
                        chapters.set(j, updatedChapterImmutable);
                        
                        // UPDATE FOR STORY AS WELL CREATE NEW OBJECT FOR IMMUTABILITY
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
