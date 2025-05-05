package com.example.sumativaPosts.dto;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.constraints.NotBlank;

public class ThreadDto {
    
    private Long id;
    
    @NotBlank(message = "Thread title is required")
    private String title;
    
    private LocalDateTime createdAt;
    private LocalDateTime lastUpdatedAt;
    private Integer userId;
    private Long categoryId;
    private String categoryName;
    private String firstPostContent;
    private List<PostDto> posts;
    
    public ThreadDto() {
    }
    
    public ThreadDto(
            Long id,
            String title,
            LocalDateTime createdAt,
            LocalDateTime lastUpdatedAt,
            Integer userId,
            Long categoryId,
            String categoryName,
            String firstPostContent
        ) {
        this.id = id;
        this.title = title;
        this.createdAt = createdAt;
        this.lastUpdatedAt = lastUpdatedAt;
        this.userId = userId;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.firstPostContent = firstPostContent;
    }

    public String getFirstPostContent() {
        return firstPostContent;
    }

    public void setFirstPostContent(String firstPostContent) {
        this.firstPostContent = firstPostContent;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getLastUpdatedAt() {
        return lastUpdatedAt;
    }
    
    public void setLastUpdatedAt(LocalDateTime lastUpdatedAt) {
        this.lastUpdatedAt = lastUpdatedAt;
    }
    
    public Integer getUserId() {
        return userId;
    }
    
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    
    public Long getCategoryId() {
        return categoryId;
    }
    
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
    
    public String getCategoryName() {
        return categoryName;
    }
    
    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
    
    public List<PostDto> getPosts() {
        return posts;
    }
    
    public void setPosts(List<PostDto> posts) {
        this.posts = posts;
    }
} 