package com.example.sumativaPosts.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.sumativaPosts.dto.PostDto;
import com.example.sumativaPosts.exception.UnauthorizedAccessException;
import com.example.sumativaPosts.security.SecurityUtils;
import com.example.sumativaPosts.service.PostService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final SecurityUtils securityUtils;

    @Autowired
    public PostController(PostService postService, SecurityUtils securityUtils) {
        this.postService = postService;
        this.securityUtils = securityUtils;
    }

    @GetMapping
    public ResponseEntity<List<PostDto>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }
    
    @GetMapping("/thread/{threadId}")
    public ResponseEntity<List<PostDto>> getPostsByThreadId(@PathVariable Long threadId) {
        return ResponseEntity.ok(postService.getPostsByThreadId(threadId));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostDto>> getPostsByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(postService.getPostsByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDto> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @PostMapping
    public ResponseEntity<PostDto> createPost(@Valid @RequestBody PostDto postDto) {
        Integer currentUserId = securityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new UnauthorizedAccessException("Authentication required");
        }
        
        postDto.setUserId(currentUserId);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.createPost(postDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostDto> updatePost(@PathVariable Long id, @Valid @RequestBody PostDto postDto) {
        PostDto existingPost = postService.getPostById(id);
        
        if (!securityUtils.isCurrentUserIdOrModerator(existingPost.getUserId())) {
            throw new UnauthorizedAccessException("You can only update your own posts");
        }
        
        postDto.setUserId(existingPost.getUserId());
        
        return ResponseEntity.ok(postService.updatePost(id, postDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        PostDto existingPost = postService.getPostById(id);
        
        if (!securityUtils.isCurrentUserIdOrModerator(existingPost.getUserId())) {
            throw new UnauthorizedAccessException("You can only delete your own posts");
        }
        
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<PostDto>> searchPosts(@RequestParam String query) {
        return ResponseEntity.ok(postService.searchPosts(query));
    }
} 