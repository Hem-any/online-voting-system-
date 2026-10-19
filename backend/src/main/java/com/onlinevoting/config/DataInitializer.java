package com.onlinevoting.config;

import com.onlinevoting.entity.Candidate;
import com.onlinevoting.entity.Election;
import com.onlinevoting.entity.Role;
import com.onlinevoting.entity.User;
import com.onlinevoting.repository.CandidateRepository;
import com.onlinevoting.repository.ElectionRepository;
import com.onlinevoting.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Configuration
public class DataInitializer {

    @Value("${app.bootstrap-admin.email:}")
    private String bootstrapAdminEmail;

    @Value("${app.bootstrap-admin.password:}")
    private String bootstrapAdminPassword;

    @Bean
    public CommandLineRunner initData(UserRepository userRepository,
            ElectionRepository electionRepository,
            CandidateRepository candidateRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            boolean hasBootstrapEmail = bootstrapAdminEmail != null && !bootstrapAdminEmail.isBlank();
            boolean hasBootstrapPassword = bootstrapAdminPassword != null && !bootstrapAdminPassword.isBlank();
            if (hasBootstrapEmail != hasBootstrapPassword) {
                throw new IllegalStateException("Both bootstrap administrator email and password must be configured.");
            }
            if (hasBootstrapEmail && bootstrapAdminPassword.length() < 12) {
                throw new IllegalStateException("Bootstrap administrator password must be at least 12 characters.");
            }
            if (hasBootstrapEmail && !userRepository.existsByEmail(bootstrapAdminEmail)) {
                userRepository.save(new User(
                        "Administrator",
                        bootstrapAdminEmail,
                        "ADMIN-" + UUID.randomUUID(),
                        passwordEncoder.encode(bootstrapAdminPassword),
                        Role.ADMIN));
            }

            if (electionRepository.count() == 0) {
                Election election = electionRepository.save(new Election(
                        "Student Council Election",
                        "Choose the student representatives for the council.",
                        LocalDate.now().plusDays(30),
                        "ACTIVE"));

                candidateRepository.saveAll(List.of(
                        new Candidate("Amina Hassan", "Unity Party", "President",
                                "A leader for fair elections and campus transparency.", election),
                        new Candidate("Omar Abdi", "Progress Alliance", "Vice President",
                                "Committed to inclusive student participation.", election)));
            }
        };
    }
}
