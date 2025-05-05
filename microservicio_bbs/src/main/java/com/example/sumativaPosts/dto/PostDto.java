package com.example.sumativaPosts.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;

public class PostDto {
    
    private Long id;
    
    @NotBlank(message = "Post content is required")
    private String content;
    
    private LocalDateTime createdAt;
    private LocalDateTime lastUpdatedAt;
    private Integer userId;
    private Long threadId;
    private String threadTitle;
    
    public PostDto() {
    }
    
    public PostDto(
            Long id,
            String content,
            LocalDateTime createdAt,
            LocalDateTime lastUpdatedAt,
            Integer userId,
            Long threadId,
            String threadTitle
        ) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
        this.lastUpdatedAt = lastUpdatedAt;
        this.userId = userId;
        this.threadId = threadId;
        this.threadTitle = threadTitle;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
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
    
    public Long getThreadId() {
        return threadId;
    }
    
    public void setThreadId(Long threadId) {
        this.threadId = threadId;
    }
    
    public String getThreadTitle() {
        return threadTitle;
    }
    
    public void setThreadTitle(String threadTitle) {
        this.threadTitle = threadTitle;
    }
} 