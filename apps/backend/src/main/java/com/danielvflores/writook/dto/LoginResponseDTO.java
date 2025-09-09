package com.danielvflores.writook.dto;

public class LoginResponseDTO {
    private String username;
    private String password;


    // GETTERS AND SETTERS FOR ALL FIELDS THIS CLASS IS MUTABLE AND FLEXIBLE.
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

}
