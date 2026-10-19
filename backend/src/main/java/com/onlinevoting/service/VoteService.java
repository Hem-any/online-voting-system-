package com.onlinevoting.service;

import com.onlinevoting.dto.VoteRequest;
import com.onlinevoting.entity.Candidate;
import com.onlinevoting.entity.Election;
import com.onlinevoting.entity.User;
import com.onlinevoting.entity.Vote;
import com.onlinevoting.repository.CandidateRepository;
import com.onlinevoting.repository.ElectionRepository;
import com.onlinevoting.repository.UserRepository;
import com.onlinevoting.repository.VoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class VoteService {

    private final VoteRepository voteRepository;
    private final UserRepository userRepository;
    private final ElectionRepository electionRepository;
    private final CandidateRepository candidateRepository;

    public VoteService(VoteRepository voteRepository, UserRepository userRepository,
            ElectionRepository electionRepository, CandidateRepository candidateRepository) {
        this.voteRepository = voteRepository;
        this.userRepository = userRepository;
        this.electionRepository = electionRepository;
        this.candidateRepository = candidateRepository;
    }

    @Transactional
    public Vote castVote(Long userId, VoteRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        Election election = electionRepository.findById(request.getElectionId())
                .orElseThrow(() -> new IllegalArgumentException("Election not found."));
        Candidate candidate = candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found."));

        if (!candidate.getElection().getId().equals(election.getId())) {
            throw new IllegalArgumentException("Candidate does not belong to selected election.");
        }

        if (!"ACTIVE".equals(election.getStatus())) {
            throw new IllegalStateException("Cannot vote in a closed election.");
        }
        if (election.getEndDate().isBefore(LocalDate.now())) {
            throw new IllegalStateException("Cannot vote after the election end date.");
        }

        if (voteRepository.findByUserAndElection(user, election).isPresent()) {
            throw new IllegalStateException("User has already voted in this election.");
        }

        candidate.incrementVoteCount();
        candidateRepository.save(candidate);

        Vote vote = new Vote(user, election, candidate);
        return voteRepository.save(vote);
    }

    public List<Map<String, Object>> getElectionResults() {
        return electionRepository.findAll().stream()
                .map(election -> {
                    long totalVotes = voteRepository.countByElection(election);
                    var candidateSummaries = candidateRepository.findAllByElection(election).stream()
                            .map(candidate -> Map.<String, Object>of(
                                    "id", candidate.getId(),
                                    "name", candidate.getName(),
                                    "party", candidate.getParty(),
                                    "votes", candidate.getVoteCount(),
                                    "electionId", election.getId(),
                                    "electionTitle", election.getTitle()))
                            .collect(Collectors.toList());
                    return Map.<String, Object>of(
                            "electionId", election.getId(),
                            "title", election.getTitle(),
                            "totalVotes", totalVotes,
                            "status", election.getStatus(),
                            "candidates", candidateSummaries);
                })
                .collect(Collectors.toList());
    }
}
