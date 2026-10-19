package com.onlinevoting.repository;

import com.onlinevoting.entity.Election;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ElectionRepository extends JpaRepository<Election, Long> {
    List<Election> findAllByStatus(String status);
}
