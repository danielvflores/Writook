package com.danielvflores.writook.dto;

public class StoryDraftDTO {
    private String title;
    private String content;
    private int wordCount;
    
    public StoryDraftDTO() {}
    
    public StoryDraftDTO(String title, String content, int wordCount) {
        this.title = title;
        this.content = content;
        this.wordCount = wordCount;
    }

    // GETTERS AND SETTERS FOR ALL FIELDS THIS CLASS IS MUTABLE AND FLEXIBLE.
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public int getWordCount() { return wordCount; }
    public void setWordCount(int wordCount) { this.wordCount = wordCount; }
}
