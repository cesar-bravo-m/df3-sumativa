package com.example.sumativaPosts.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.sumativaPosts.dto.PostDto;
import com.example.sumativaPosts.dto.ThreadDto;
import com.example.sumativaPosts.dto.ThreadSummaryDto;
import com.example.sumativaPosts.model.Category;
import com.example.sumativaPosts.model.Post;
import com.example.sumativaPosts.model.Thread;
import com.example.sumativaPosts.repository.CategoryRepository;
import com.example.sumativaPosts.repository.ThreadRepository;
import com.example.sumativaPosts.service.ThreadService;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ThreadServiceImpl implements ThreadService {

    private final ThreadRepository threadRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public ThreadServiceImpl(ThreadRepository threadRepository, CategoryRepository categoryRepository) {
        this.threadRepository = threadRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<ThreadSummaryDto> getAllThreads() {
        return threadRepository.findAll().stream()
                .map(this::convertToSummaryDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ThreadSummaryDto> getThreadsByCategoryId(Long categoryId) {
        return threadRepository.findByCategoryId(categoryId).stream()
                .map(this::convertToSummaryDto)
                .collect(Collectors.toList());
    }

    @Override
    public ThreadDto getThreadById(Long id) {
        Thread thread = threadRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Thread not found with id: " + id));
        return convertToDto(thread);
    }

    @Override
    public ThreadDto createThread(ThreadDto threadDto) {
        Category category = categoryRepository.findById(threadDto.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + threadDto.getCategoryId()));
        
        Thread thread = new Thread();
        thread.setTitle(threadDto.getTitle());
        thread.setUserId(threadDto.getUserId());
        thread.setCategory(category);
        thread.setCreatedAt(LocalDateTime.now());
        thread.setLastUpdatedAt(LocalDateTime.now());
        
        Thread savedThread = threadRepository.save(thread);
        return convertToDto(savedThread);
    }

    @Override
    public ThreadDto updateThread(Long id, ThreadDto threadDto) {
        Thread thread = threadRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Thread not found with id: " + id));
        
        if (threadDto.getCategoryId() != null && !threadDto.getCategoryId().equals(thread.getCategory().getId())) {
            Category category = categoryRepository.findById(threadDto.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + threadDto.getCategoryId()));
            thread.setCategory(category);
        }
        
        thread.setTitle(threadDto.getTitle());
        
        Thread updatedThread = threadRepository.save(thread);
        return convertToDto(updatedThread);
    }

    @Override
    public void deleteThread(Long id) {
        if (!threadRepository.existsById(id)) {
            throw new EntityNotFoundException("Thread not found with id: " + id);
        }
        threadRepository.deleteById(id);
    }
    
    private ThreadSummaryDto convertToSummaryDto(Thread thread) {
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
    
    private ThreadDto convertToDto(Thread thread) {
        ThreadDto dto = new ThreadDto();
        dto.setId(thread.getId());
        dto.setTitle(thread.getTitle());
        dto.setCreatedAt(thread.getCreatedAt());
        dto.setLastUpdatedAt(thread.getLastUpdatedAt());
        dto.setUserId(thread.getUserId());
        dto.setCategoryId(thread.getCategory().getId());
        dto.setCategoryName(thread.getCategory().getName());
        
        if (thread.getPosts() != null && !thread.getPosts().isEmpty()) {
            List<PostDto> postDtos = thread.getPosts().stream()
                    .map(this::convertToPostDto)
                    .collect(Collectors.toList());
            dto.setPosts(postDtos);
        }
        
        return dto;
    }
    
    private PostDto convertToPostDto(Post post) {
        PostDto dto = new PostDto();
        dto.setId(post.getId());
        dto.setContent(post.getContent());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setLastUpdatedAt(post.getLastUpdatedAt());
        dto.setUserId(post.getUserId());
        dto.setThreadId(post.getThread().getId());
        dto.setThreadTitle(post.getThread().getTitle());
        
        return dto;
    }

    @Override
    public List<ThreadSummaryDto> searchThreads(String query) {
        return threadRepository.findAll().stream()
                .filter(thread -> thread.getTitle().toLowerCase().contains(query.toLowerCase()))
                .map(this::convertToSummaryDto)
                .collect(Collectors.toList());
    }
} 