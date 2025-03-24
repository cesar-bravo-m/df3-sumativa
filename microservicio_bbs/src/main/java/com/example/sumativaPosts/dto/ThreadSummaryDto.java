package com.example.sumativaPosts.dto;

import java.time.LocalDateTime;

public class ThreadSummaryDto {
    
    private Long id;
    private String title;
    private LocalDateTime createdAt;
    private LocalDateTime lastUpdatedAt;
    private Integer userId;
    private Long categoryId;
    private int postCount;
    
    public ThreadSummaryDto() {
    }
    
    public ThreadSummaryDto(Long id, String title, LocalDateTime createdAt, LocalDateTime lastUpdatedAt, Integer userId, Long categoryId, int postCount) {
        this.id = id;
        this.title = title;
        this.createdAt = createdAt;
        this.lastUpdatedAt = lastUpdatedAt;
        this.userId = userId;
        this.categoryId = categoryId;
        this.postCount = postCount;
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
    
    public int getPostCount() {
        return postCount;
    }
    
    public void setPostCount(int postCount) {
        this.postCount = postCount;
    }
} 