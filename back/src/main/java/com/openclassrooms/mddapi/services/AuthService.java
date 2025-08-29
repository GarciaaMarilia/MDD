package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.payload.request.LoginRequest;
import com.openclassrooms.mddapi.payload.request.RegisterRequest;
import com.openclassrooms.mddapi.payload.request.UpdateRequest;
import com.openclassrooms.mddapi.payload.response.JwtResponse;
import com.openclassrooms.mddapi.payload.response.LoginResponse;
import com.openclassrooms.mddapi.payload.response.UserResponse;
import com.openclassrooms.mddapi.repositories.UserRepository;
import com.openclassrooms.mddapi.security.jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String jwt = jwtUtils.generateJwtToken(user.getEmail());
        UserResponse userResponse = new UserResponse(user.getId(), user.getUsername(), user.getEmail());

        return new LoginResponse(jwt, userResponse);
    }

    public JwtResponse register(RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already taken");
        }

        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            throw new RuntimeException("Username is already taken");
        }

        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        User savedUser = userRepository.save(user);
        String token = jwtUtils.generateJwtToken(savedUser.getEmail());

        return new JwtResponse(token, new UserResponse(savedUser.getId(), savedUser.getUsername(), savedUser.getEmail()));
    }

    public UserResponse update(UpdateRequest updateRequest) {
        User user = userRepository.findById(updateRequest.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.findByEmail(updateRequest.getEmail())
                .filter(existingUser -> !existingUser.getId().equals(updateRequest.getId()))
                .ifPresent(existingUser -> { throw new RuntimeException("Email is already taken"); });

        userRepository.findByUsername(updateRequest.getUsername())
                .filter(existingUser -> !existingUser.getId().equals(updateRequest.getId()))
                .ifPresent(existingUser -> { throw new RuntimeException("Username is already taken"); });

        user.setEmail(updateRequest.getEmail());
        user.setUsername(updateRequest.getUsername());

        if (updateRequest.getPassword() != null && !updateRequest.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
        }

        User updatedUser = userRepository.save(user);
        return new UserResponse(updatedUser.getId(), updatedUser.getUsername(), updatedUser.getEmail());
    }
}

