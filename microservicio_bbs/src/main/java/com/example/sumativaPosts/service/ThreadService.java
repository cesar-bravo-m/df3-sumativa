package com.example.sumativaPosts.service;

import java.util.List;

import com.example.sumativaPosts.dto.ThreadDto;
import com.example.sumativaPosts.dto.ThreadSummaryDto;

public interface ThreadService {
    List<ThreadSummaryDto> getAllThreads();
    List<ThreadSummaryDto> getThreadsByCategoryId(Long categoryId);
    ThreadDto getThreadById(Long id);
    ThreadDto createThread(ThreadDto threadDto);
    ThreadDto updateThread(Long id, ThreadDto threadDto);
    void deleteThread(Long id);
    List<ThreadSummaryDto> searchThreads(String query);
} 