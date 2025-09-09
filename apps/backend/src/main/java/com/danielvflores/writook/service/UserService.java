package com.danielvflores.writook.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.danielvflores.writook.model.User;

@Service
public class UserService {

    private final List<User> users = new ArrayList<>();
    private Long currentId = 1L;

    public UserService() {
    }

    public List<User> getAllUsers() {
        return users;
    }
    
    public User getUserById(Long id) {
        return users.stream()
            .filter(user -> user.getId().equals(id))
            .findFirst()
            .orElse(null);
    }
    
    public User createUser(User user) {
        user.setId(currentId++);
        users.add(user);
        return user;
    }
    
    public User updateUser(Long id, User updatedUser) {
        for (int i = 0; i < users.size(); i++) {
            if (users.get(i).getId().equals(id)) {
                updatedUser.setId(id);
                users.set(i, updatedUser);
                return updatedUser;
            }
        }
        return null;
    }
    
    public boolean deleteUser(Long id) {
        return users.removeIf(user -> user.getId().equals(id));
    }
    
    public User getUserProfile(Long id) {
        return getUserById(id);
    }

    public User findByUsername(String username) {
        return users.stream()
            .filter(user -> user.getUsername().equals(username))
            .findFirst()
            .orElse(null);
    }
}
