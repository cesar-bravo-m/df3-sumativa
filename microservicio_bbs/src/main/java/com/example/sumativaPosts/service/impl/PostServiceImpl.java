package com.example.sumativaPosts.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.sumativaPosts.dto.PostDto;
import com.example.sumativaPosts.model.Post;
import com.example.sumativaPosts.model.Thread;
import com.example.sumativaPosts.repository.PostRepository;
import com.example.sumativaPosts.repository.ThreadRepository;
import com.example.sumativaPosts.service.PostService;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final ThreadRepository threadRepository;

    @Autowired
    public PostServiceImpl(PostRepository postRepository, ThreadRepository threadRepository) {
        this.postRepository = postRepository;
        this.threadRepository = threadRepository;
    }

    @Override
    public List<PostDto> getAllPosts() {
        return postRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PostDto> getPostsByThreadId(Long threadId) {
        return postRepository.findByThreadId(threadId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PostDto> getPostsByUserId(Integer userId) {
        return postRepository.findByUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public PostDto getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + id));
        return convertToDto(post);
    }

    @Override
    public PostDto createPost(PostDto postDto) {
        Thread thread = threadRepository.findById(postDto.getThreadId())
                .orElseThrow(() -> new EntityNotFoundException("Thread not found with id: " + postDto.getThreadId()));
        
        Post post = new Post();
        post.setContent(postDto.getContent());
        post.setUserId(postDto.getUserId());
        post.setThread(thread);
        post.setCreatedAt(LocalDateTime.now());
        post.setLastUpdatedAt(LocalDateTime.now());
        
        Post savedPost = postRepository.save(post);
        
        thread.setLastUpdatedAt(LocalDateTime.now());
        threadRepository.save(thread);
        
        return convertToDto(savedPost);
    }

    @Override
    public PostDto updatePost(Long id, PostDto postDto) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + id));
        
        if (postDto.getThreadId() != null && !postDto.getThreadId().equals(post.getThread().getId())) {
            Thread thread = threadRepository.findById(postDto.getThreadId())
                    .orElseThrow(() -> new EntityNotFoundException("Thread not found with id: " + postDto.getThreadId()));
            post.setThread(thread);
        }
        
        post.setContent(postDto.getContent());
        
        Post updatedPost = postRepository.save(post);
        
        Thread thread = post.getThread();
        thread.setLastUpdatedAt(LocalDateTime.now());
        threadRepository.save(thread);
        
        return convertToDto(updatedPost);
    }

    @Override
    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + id));
        
        Thread thread = post.getThread();
        
        postRepository.deleteById(id);
        
        thread.setLastUpdatedAt(LocalDateTime.now());
        threadRepository.save(thread);
    }
    
    private PostDto convertToDto(Post post) {
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
    public List<PostDto> searchPosts(String query) {
        return postRepository.findAll().stream()
                .filter(post -> post.getContent().toLowerCase().contains(query.toLowerCase()))
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
}
  
