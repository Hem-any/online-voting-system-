package com.onlinevoting.controller;

import com.onlinevoting.dto.MessageResponse;
import com.onlinevoting.dto.VoteRequest;
import com.onlinevoting.security.UserDetailsImpl;
import com.onlinevoting.service.VoteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vote")
public class VoteController {

    private final VoteService voteService;

    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    @PostMapping
    public ResponseEntity<?> castVote(@Valid @RequestBody VoteRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        var userDetails = (UserDetailsImpl) authentication.getPrincipal();
        voteService.castVote(userDetails.getId(), request);
        return ResponseEntity.ok(new MessageResponse("Vote has been cast successfully."));
    }
}
