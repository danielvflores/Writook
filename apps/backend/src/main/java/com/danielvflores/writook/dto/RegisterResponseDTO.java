package com.danielvflores.writook.dto;

public class RegisterResponseDTO {
    
    private String username;
    private String email;
    private String displayName;

    public RegisterResponseDTO(UserResponseDTO userResponse) {
        this.username = userResponse.getUsername();
        this.email = userResponse.getEmail();
        this.displayName = userResponse.getDisplayName();
    }

    // GETTERS AND SETTERS FOR ALL FIELDS THIS CLASS IS MUTABLE AND FLEXIBLE.
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    
}
