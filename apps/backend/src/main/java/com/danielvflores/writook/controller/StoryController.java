package com.danielvflores.writook.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danielvflores.writook.model.Chapter;
import com.danielvflores.writook.model.Story;
import com.danielvflores.writook.service.StoryService;

@RestController
@RequestMapping("/api/v1/stories")
@CrossOrigin(origins = "http://localhost:3000")
public class StoryController {

    // THIS AUTOWIRED WILL BE CHANGE LATER WHEN I PRODUCE THE SERVICE
    @Autowired
    private StoryService storyService;

    @GetMapping
    public List<Story> getAllStories() {
        return storyService.getAllStories();
    }

    @GetMapping("/{id}")
    public Story getStoryById(@PathVariable("id") Long id, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return storyService.getStoryById(id, authHeader);
    }

    // Endpoint específico para verificar propiedad de historia (para /myworks)
    @GetMapping("/{id}/ownership")
    public ResponseEntity<?> getStoryByIdWithOwnershipCheck(@PathVariable("id") Long id, @RequestHeader("Authorization") String authHeader) {
        try {
            Story story = storyService.getStoryWithOwnershipCheck(id, authHeader);
            return ResponseEntity.ok(story);
        } catch (RuntimeException e) {
            String message = e.getMessage();
            if (message.contains("Token") || message.contains("permiso")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(message);
            } else if (message.contains("no encontrada")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
            }
        }
    }

    @PostMapping
    public Story createStory(@RequestBody Story story) {
        return storyService.createStory(story);
    }

    @PutMapping("/{id}")
    public Story updateStory(@PathVariable("id") Long id, @RequestBody Story updatedStory) {
        return storyService.updateStory(id, updatedStory);
    }

    @DeleteMapping("/{id}")
    public String deleteStory(@PathVariable("id") Long id) {
        boolean deleted = storyService.deleteStory(id);
        return deleted ? "Story with ID " + id + " deleted successfully" : "Story not found";
    }

    @GetMapping("/author/{username}")
    public List<Story> getStoriesByAuthorUsername(@PathVariable("username") String username) {
        return storyService.getStoriesByAuthorUsername(username);
    }

    @PutMapping("/{storyId}/edit/{chapterId}")
    public ResponseEntity<?> updateChapter(@PathVariable("storyId") Long storyId, @PathVariable("chapterId") Long chapterId, @RequestBody Chapter updatedChapter, @RequestHeader("Authorization") String authHeader) {
        try {
            Chapter result = storyService.updateChapter(storyId, chapterId, updatedChapter, authHeader);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            String message = e.getMessage();
            if (message.contains("Token") || message.contains("permiso")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(message);
            } else if (message.contains("no encontrada") || message.contains("no encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
            }
        }
    }

    // ADD OTHERS ENDPOINTS LATER FOR GENRES, TAGS, ETC. (MISSING FOR NOW)

}
