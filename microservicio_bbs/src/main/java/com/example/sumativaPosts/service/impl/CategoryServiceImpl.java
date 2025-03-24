package com.example.sumativaPosts.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.sumativaPosts.dto.CategoryDto;
import com.example.sumativaPosts.dto.ThreadSummaryDto;
import com.example.sumativaPosts.model.Category;
import com.example.sumativaPosts.model.Thread;
import com.example.sumativaPosts.repository.CategoryRepository;
import com.example.sumativaPosts.service.CategoryService;

import jakarta.persistence.EntityNotFoundException;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id));
        return convertToDto(category);
    }

    @Override
    public CategoryDto createCategory(CategoryDto categoryDto) {
        Category category = new Category();
        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());
        
        Category savedCategory = categoryRepository.save(category);
        return convertToDto(savedCategory);
    }

    @Override
    public CategoryDto updateCategory(Long id, CategoryDto categoryDto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id));
        
        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());
        
        Category updatedCategory = categoryRepository.save(category);
        return convertToDto(updatedCategory);
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new EntityNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
    
    private CategoryDto convertToDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        
        if (category.getThreads() != null && !category.getThreads().isEmpty()) {
            List<ThreadSummaryDto> threadDtos = category.getThreads().stream()
                    .map(this::convertToThreadSummaryDto)
                    .collect(Collectors.toList());
            dto.setThreads(threadDtos);
        }
        
        return dto;
    }
    
    private ThreadSummaryDto convertToThreadSummaryDto(Thread thread) {
        ThreadSummaryDto dto = new ThreadSummaryDto();
        dto.setId(thread.getId());
        dto.setTitle(thread.getTitle());
        dto.setCreatedAt(thread.getCreatedAt());
        dto.setLastUpdatedAt(thread.getLastUpdatedAt());
        dto.setUserId(thread.getUserId());
        dto.setCategoryId(thread.getCategory().getId());
        dto.setPostCount(thread.getPosts().size());
        
        return dto;
    }
} 