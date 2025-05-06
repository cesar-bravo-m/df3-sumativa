package com.example.sumativaPosts.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.sumativaPosts.dto.ThreadDto;
import com.example.sumativaPosts.dto.ThreadSummaryDto;
import com.example.sumativaPosts.exception.UnauthorizedAccessException;
import com.example.sumativaPosts.security.SecurityUtils;
import com.example.sumativaPosts.service.PostService;
import com.example.sumativaPosts.service.ThreadService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/threads")
public class ThreadController {

    private final ThreadService threadService;
    private final PostService postService;
    private final SecurityUtils securityUtils;
    private final JdbcTemplate jdbcTemplate;


    @Autowired
    public ThreadController(ThreadService threadService, SecurityUtils securityUtils, PostService postService, JdbcTemplate jdbcTemplate) {
        this.threadService = threadService;
        this.securityUtils = securityUtils;
        this.postService = postService;
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public ResponseEntity<List<ThreadSummaryDto>> getAllThreads() {
        return ResponseEntity.ok(threadService.getAllThreads());
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ThreadSummaryDto>> getThreadsByCategoryId(@PathVariable Long categoryId) {
        return ResponseEntity.ok(threadService.getThreadsByCategoryId(categoryId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThreadDto> getThreadById(@PathVariable Long id) {
        return ResponseEntity.ok(threadService.getThreadById(id));
    }

    @PostMapping
    public ResponseEntity<ThreadDto> createThread(@Valid @RequestBody ThreadDto threadDto) {
        Integer currentUserId = securityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new UnauthorizedAccessException("Authentication required");
        }
        
        threadDto.setUserId(currentUserId);

        ThreadDto newThread = threadService.createThread(threadDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(newThread);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ThreadDto> updateThread(@PathVariable Long id, @Valid @RequestBody ThreadDto threadDto) {
        ThreadDto existingThread = threadService.getThreadById(id);
        
        if (!securityUtils.isCurrentUserIdOrModerator(existingThread.getUserId())) {
            throw new UnauthorizedAccessException("You can only update your own threads");
        }
        
        threadDto.setUserId(existingThread.getUserId());
        
        return ResponseEntity.ok(threadService.updateThread(id, threadDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteThread(@PathVariable Long id) {
        ThreadDto existingThread = threadService.getThreadById(id);
        
        if (!securityUtils.isCurrentUserIdOrModerator(existingThread.getUserId())) {
            throw new UnauthorizedAccessException("You can only delete your own threads");
        }
        
        threadService.deleteThread(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<ThreadSummaryDto>> searchThreads(@RequestParam String query) {
        return ResponseEntity.ok(threadService.searchThreads(query));
    }
} 