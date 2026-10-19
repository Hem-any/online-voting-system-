package com.onlinevoting.controller;

import com.onlinevoting.dto.CreateElectionRequest;
import com.onlinevoting.entity.Election;
import com.onlinevoting.service.ElectionService;
import com.onlinevoting.service.VoteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/elections")
public class ElectionController {

    private final ElectionService electionService;
    private final VoteService voteService;

    public ElectionController(ElectionService electionService, VoteService voteService) {
        this.electionService = electionService;
        this.voteService = voteService;
    }

    @GetMapping
    public ResponseEntity<List<Election>> getElections() {
        return ResponseEntity.ok(electionService.getAllElections());
    }

    @GetMapping("/results")
    public ResponseEntity<?> getResults() {
        return ResponseEntity.ok(voteService.getElectionResults());
    }

    @PostMapping
    public ResponseEntity<Election> createElection(@Valid @RequestBody CreateElectionRequest request) {
        return ResponseEntity.ok(electionService.createElection(request));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Election> toggleElection(@PathVariable Long id) {
        return ResponseEntity.ok(electionService.toggleElection(id));
    }
}
