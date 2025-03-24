package com.example.sumativaPosts.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.sumativaPosts.model.Thread;

@Repository
public interface ThreadRepository extends JpaRepository<Thread, Long> {
    List<Thread> findByCategoryId(Long categoryId);
} 