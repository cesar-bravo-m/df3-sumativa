package com.example.sumativaPosts.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;

public class CategoryDto {
    
    private Long id;
    
    @NotBlank(message = "Category name is required")
    private String name;
    
    private String description;
    
    private List<ThreadSummaryDto> threads;
    
    public CategoryDto() {
    }
    
    public CategoryDto(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public List<ThreadSummaryDto> getThreads() {
        return threads;
    }
    
    public void setThreads(List<ThreadSummaryDto> threads) {
        this.threads = threads;
    }
} 