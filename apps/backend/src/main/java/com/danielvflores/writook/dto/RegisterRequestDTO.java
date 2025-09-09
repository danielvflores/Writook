package com.danielvflores.writook.dto;

public class RegisterRequestDTO {
    private String username;
    private String email;
    private String password;
    private String displayName;

    // GETTERS AND SETTERS FOR ALL FIELDS THIS CLASS IS MUTABLE AND FLEXIBLE.
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
}