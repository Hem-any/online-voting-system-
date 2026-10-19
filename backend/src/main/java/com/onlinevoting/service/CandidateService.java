package com.onlinevoting.service;

import com.onlinevoting.entity.Candidate;
import com.onlinevoting.entity.Election;
import com.onlinevoting.repository.CandidateRepository;
import com.onlinevoting.repository.ElectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final ElectionRepository electionRepository;

    public CandidateService(CandidateRepository candidateRepository, ElectionRepository electionRepository) {
        this.candidateRepository = candidateRepository;
        this.electionRepository = electionRepository;
    }

    public List<Candidate> getCandidatesByElectionId(Long electionId) {
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new IllegalArgumentException("Election not found."));
        return candidateRepository.findAllByElection(election);
    }

    @Transactional
    public Candidate createCandidate(Candidate candidate, Long electionId) {
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new IllegalArgumentException("Election not found."));
        candidate.setElection(election);
        return candidateRepository.save(candidate);
    }
}
