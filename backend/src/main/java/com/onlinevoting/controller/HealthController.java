package com.onlinevoting.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(new java.util.HashMap<String, String>() {{
            put("status", "Backend is running");
            put("message", "Online Voting System API");
        }});
    }

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(new java.util.HashMap<String, String>() {{
            put("status", "OK");
        }});
    }
}
