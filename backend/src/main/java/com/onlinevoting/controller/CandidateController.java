package com.onlinevoting.controller;

import com.onlinevoting.dto.CandidateRequest;
import com.onlinevoting.entity.Candidate;
import com.onlinevoting.service.CandidateService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/candidates")
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @GetMapping("/election/{electionId}")
    public ResponseEntity<List<Candidate>> getCandidates(@PathVariable Long electionId) {
        return ResponseEntity.ok(candidateService.getCandidatesByElectionId(electionId));
    }

    @PostMapping
    public ResponseEntity<Candidate> createCandidate(@Valid @RequestBody CandidateRequest request) {
        Candidate candidate = new Candidate();
        candidate.setName(request.getName());
        candidate.setParty(request.getParty());
        candidate.setRole(request.getRole());
        candidate.setBio(request.getBio());
        return ResponseEntity.ok(candidateService.createCandidate(candidate, request.getElectionId()));
    }
}
