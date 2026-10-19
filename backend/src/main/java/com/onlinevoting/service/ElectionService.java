package com.onlinevoting.service;

import com.onlinevoting.dto.CreateElectionRequest;
import com.onlinevoting.entity.Election;
import com.onlinevoting.repository.ElectionRepository;
import com.onlinevoting.repository.VoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ElectionService {

    private final ElectionRepository electionRepository;
    private final VoteRepository voteRepository;

    public ElectionService(ElectionRepository electionRepository, VoteRepository voteRepository) {
        this.electionRepository = electionRepository;
        this.voteRepository = voteRepository;
    }

    public List<Election> getAllElections() {
        return electionRepository.findAll();
    }

    public List<Election> getActiveElections() {
        return electionRepository.findAllByStatus("ACTIVE");
    }

    @Transactional
    public Election createElection(CreateElectionRequest request) {
        Election election = new Election(
                request.getTitle(),
                request.getDescription(),
                request.getEndDate(),
                "ACTIVE");
        return electionRepository.save(election);
    }

    @Transactional
    public Election toggleElection(Long id) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Election not found."));
        election.setStatus(election.getStatus().equals("ACTIVE") ? "CLOSED" : "ACTIVE");
        return electionRepository.save(election);
    }

    @Transactional
    public void deleteElection(Long id) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Election not found."));
        voteRepository.deleteByElection(election);
        electionRepository.delete(election);
    }
}
