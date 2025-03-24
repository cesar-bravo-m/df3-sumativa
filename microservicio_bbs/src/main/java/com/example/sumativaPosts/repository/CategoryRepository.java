package com.example.sumativaPosts.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.sumativaPosts.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
} 