package com.onlinevoting.service;

import com.onlinevoting.dto.RegisterRequest;
import com.onlinevoting.entity.Role;
import com.onlinevoting.entity.User;
import com.onlinevoting.repository.UserRepository;
import com.onlinevoting.repository.VoteRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final VoteRepository voteRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, VoteRepository voteRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.voteRepository = voteRepository;
    }

    @Transactional
    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered.");
        }
        if (userRepository.existsByVoterId(request.getVoterId())) {
            throw new IllegalArgumentException("Voter ID already in use.");
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                request.getVoterId(),
                passwordEncoder.encode(request.getPassword()),
                Role.VOTER);

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User createUser(String name, String email, String password, String roleStr) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered.");
        }
        Role role = Role.VOTER;
        if ("Administrator".equalsIgnoreCase(roleStr) || "ADMIN".equalsIgnoreCase(roleStr)) {
            role = Role.ADMIN;
        }

        String voterId = "VID-" + System.currentTimeMillis();
        User user = new User(name, email, voterId, passwordEncoder.encode(password), role);
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        voteRepository.deleteByUser(user);
        userRepository.delete(user);
    }
}
