package com.onlinevoting.controller;

import com.onlinevoting.dto.CreateElectionRequest;
import com.onlinevoting.dto.CreateUserRequest;
import com.onlinevoting.entity.Election;
import com.onlinevoting.entity.User;
import com.onlinevoting.service.ElectionService;
import com.onlinevoting.service.VoteService;
import com.onlinevoting.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ElectionService electionService;
    private final VoteService voteService;
    private final UserService userService;

    public AdminController(ElectionService electionService, VoteService voteService, UserService userService) {
        this.electionService = electionService;
        this.voteService = voteService;
        this.userService = userService;
    }

    @PostMapping("/elections")
    public ResponseEntity<Election> createElection(@Valid @RequestBody CreateElectionRequest request) {
        return ResponseEntity.ok(electionService.createElection(request));
    }

    @PatchMapping("/elections/{id}/toggle")
    public ResponseEntity<Election> toggleElection(@PathVariable Long id) {
        return ResponseEntity.ok(electionService.toggleElection(id));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalElections = electionService.getAllElections().size();
        long totalVotes = voteService.getElectionResults().stream()
                .mapToLong(result -> (long) result.get("totalVotes"))
                .sum();
        return ResponseEntity.ok(Map.of(
                "totalElections", totalElections,
                "totalVotes", totalVotes));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@Valid @RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(userService.createUser(
                request.getName(), request.getEmail(), request.getPassword(), request.getRole()));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully."));
    }

    @DeleteMapping("/elections/{id}")
    public ResponseEntity<Map<String, String>> deleteElection(@PathVariable Long id) {
        electionService.deleteElection(id);
        return ResponseEntity.ok(Map.of("message", "Election deleted successfully."));
    }
}
