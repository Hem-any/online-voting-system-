package com.onlinevoting.repository;

import com.onlinevoting.entity.Election;
import com.onlinevoting.entity.User;
import com.onlinevoting.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByUserAndElection(User user, Election election);

    List<Vote> findAllByElection(Election election);

    long countByElection(Election election);

    void deleteByUser(User user);

    void deleteByElection(Election election);
}
