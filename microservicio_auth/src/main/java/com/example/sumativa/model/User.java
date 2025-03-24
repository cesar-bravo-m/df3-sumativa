package com.example.sumativa.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "USERS",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = "username"),
           @UniqueConstraint(columnNames = "email")
       })
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(max = 120)
    private String password;
    
    @Enumerated(EnumType.STRING)
    private ERole role;
    
    // Keep isAdmin for backward compatibility
    private boolean isAdmin;

    public User() {
    }

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = ERole.NORMAL_POSTER; // By default, users have normalPoster role
        this.isAdmin = false; // By default, users are not admins
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public ERole getRole() {
        return role;
    }

    public void setRole(ERole role) {
        this.role = role;
        // Update isAdmin field based on role
        this.isAdmin = (role == ERole.MODERATOR);
    }
    
    public boolean isModerator() {
        return this.role == ERole.MODERATOR;
    }
    
    // For backward compatibility
    public boolean isAdmin() {
        return isAdmin;
    }

    // For backward compatibility
    public void setAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
        // Update role field based on isAdmin
        this.role = isAdmin ? ERole.MODERATOR : ERole.NORMAL_POSTER;
    }
} 