package com.danielvflores.writook.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Chapter {
    private final String title;
    private final String content;
    private final int number;

    @JsonCreator
    public Chapter(
            @JsonProperty("title") String title, 
            @JsonProperty("content") String content, 
            @JsonProperty("number") int number) {
        this.title = title;
        this.content = content;
        this.number = number;
    }

    // ONLY GETTERS ARE NEEDED, SINCE THESE FIELDS DON’T NEED TO BE MODIFIED AFTER CREATING THE OBJECT. A CHAPTER IS IMMUTABLE.
    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public int getNumber() {
        return number;
    }
}
