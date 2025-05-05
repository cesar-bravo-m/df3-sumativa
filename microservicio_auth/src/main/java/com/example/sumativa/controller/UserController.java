package com.example.sumativa.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.sumativa.model.User;
import com.example.sumativa.payload.response.MessageResponse;
import com.example.sumativa.repository.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    UserRepository userRepository;
    
    @Autowired
    PasswordEncoder encoder;

    @GetMapping
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR') or authentication.principal.id == #id")
    public ResponseEntity<?> getUserById(@PathVariable("id") long id) {
        Optional<User> userData = userRepository.findById(id);

        if (userData.isPresent()) {
            User user = userData.get();
            user.setPassword("");
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable("email") String email) {
        Optional<User> userData = userRepository.findByEmail(email);
        System.out.println("email: " + email);
        System.out.println("userData: " + userData);

        if (userData.isPresent()) {
            User user = userData.get();
            user.setPassword("");
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    // @PreAuthorize("hasRole('MODERATOR') or authentication.principal.id == #id")
    public ResponseEntity<?> updateUser(@PathVariable("id") long id, @Valid @RequestBody User user) {
        Optional<User> userData = userRepository.findById(id);

        if (userData.isPresent()) {
            User existingUser = userData.get();
            
            if (user.getUsername() != null && !user.getUsername().isEmpty()) {
                if (!existingUser.getUsername().equals(user.getUsername()) && 
                    userRepository.existsByUsername(user.getUsername())) {
                    return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
                }
                existingUser.setUsername(user.getUsername());
            }
            
            if (user.getEmail() != null && !user.getEmail().isEmpty()) {
                if (!existingUser.getEmail().equals(user.getEmail()) && 
                    userRepository.existsByEmail(user.getEmail())) {
                    return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
                }
                existingUser.setEmail(user.getEmail());
            }
            
            if (user.getPassword() != null && !user.getPassword().isEmpty() && !user.getPassword().equals("null")) {
                existingUser.setPassword(encoder.encode(user.getPassword()));
            }
            
            if (user.getRole() != null && user.getRole() != existingUser.getRole()) {
                existingUser.setRole(user.getRole());
            }
            
            return new ResponseEntity<>(userRepository.save(existingUser), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") long id) {
        try {
            userRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 