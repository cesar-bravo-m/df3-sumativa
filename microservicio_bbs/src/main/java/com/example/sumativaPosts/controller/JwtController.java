package com.example.sumativaPosts.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.sumativaPosts.dto.JwtRequest;
import com.example.sumativaPosts.util.JwtUtil;

@RestController
@RequestMapping("/api/jwt")
public class JwtController {

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/decode")
    public ResponseEntity<?> decodeToken(@RequestParam("token") String token) {
        try {
            Map<String, Object> claims = jwtUtil.getClaimsAsMap(token);
            return ResponseEntity.ok(claims);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid token: " + e.getMessage());
        }
    }
    
    @PostMapping("/decode")
    public ResponseEntity<?> decodeTokenPost(@RequestBody JwtRequest request) {
        try {
            Map<String, Object> claims = jwtUtil.getClaimsAsMap(request.getToken());
            return ResponseEntity.ok(claims);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid token: " + e.getMessage());
        }
    }
    
    @GetMapping("/generate")
    public ResponseEntity<?> generateSampleToken(@RequestParam(value = "username", defaultValue = "testuser") String username) {
        String token = jwtUtil.generateSampleToken(username);
        return ResponseEntity.ok(token);
    }
    
    @GetMapping("/generate/normal-user")
    public ResponseEntity<?> generateNormalUserToken(
            @RequestParam(value = "username", defaultValue = "normaluser") String username,
            @RequestParam(value = "userId", defaultValue = "1") Integer userId) {
        
        String token = jwtUtil.generateToken(username, userId, List.of("ROLE_NORMAL_USER"));
        return ResponseEntity.ok(token);
    }
    
    @GetMapping("/generate/moderator")
    public ResponseEntity<?> generateModeratorToken(
            @RequestParam(value = "username", defaultValue = "moderator") String username,
            @RequestParam(value = "userId", defaultValue = "2") Integer userId) {
        
        String token = jwtUtil.generateToken(username, userId, List.of("ROLE_MODERATOR"));
        return ResponseEntity.ok(token);
    }
} 