package com.onlinevoting.repository;

import com.onlinevoting.entity.Candidate;
import com.onlinevoting.entity.Election;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    List<Candidate> findAllByElection(Election election);
}
