package com.danielvflores.writook.model;

import java.util.List;

import com.danielvflores.writook.dto.AuthorDTO;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Story {
    private final String title;
    private final String synopsis;
    private final AuthorDTO author; // THIS IS A AGGREGATION RELATIONSHIP, THE AUTHOR CAN EXIST WITHOUT THE STORY.
    private double rating;
    private final List<String> genres;
    private final List<String> tags;
    private final List<Chapter> chapters; // THIS IS A COMPOSITION RELATIONSHIP, IF THE STORY IS DELETED, THE CHAPTERS ARE DELETED TOO.
    private Long id;

    @JsonCreator
    public Story(
            @JsonProperty("title") String title, 
            @JsonProperty("synopsis") String synopsis, 
            @JsonProperty("author") AuthorDTO author, 
            @JsonProperty("rating") double rating, 
            @JsonProperty("genres") List<String> genres, 
            @JsonProperty("tags") List<String> tags, 
            @JsonProperty("chapters") List<Chapter> chapters, 
            @JsonProperty("id") Long id) {
        this.title = title;
        this.synopsis = synopsis;
        this.author = author;
        this.rating = rating;
        this.genres = genres;
        this.tags = tags;
        this.chapters = chapters;
        this.id = id;
    }

    // ONLY GETTERS ARE REQUIRED — THE STORY OBJECT IS IMMUTABLE.
    public String getTitle() {
        return title;
    }

    public String getSynopsis() {
        return synopsis;
    }

    public AuthorDTO getAuthor() {
        return author;
    }

    public double getRating() {
        return rating;
    }

    public List<String> getGenres() {
        return genres;
    }

    public List<String> getTags() {
        return tags;
    }

    public List<Chapter> getChapters() {
        return chapters;
    }

    // ONLY SETTER FOR RATING, SINCE IT CAN CHANGE OVER TIME
    public void setRating(double rating) {
        this.rating = rating;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}