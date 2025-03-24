package com.example.sumativaPosts.service;

import java.util.List;

import com.example.sumativaPosts.dto.PostDto;

public interface PostService {
    List<PostDto> getAllPosts();
    List<PostDto> getPostsByThreadId(Long threadId);
    List<PostDto> getPostsByUserId(Integer userId);
    PostDto getPostById(Long id);
    PostDto createPost(PostDto postDto);
    PostDto updatePost(Long id, PostDto postDto);
    void deletePost(Long id);
    List<PostDto> searchPosts(String query);
} 