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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtUtils jwtUtils;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setUsername("testuser");
        user.setPassword("encodedpass");
    }

    @Test
    void login_ShouldReturnLoginResponse_WhenCredentialsAreValid() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("password");

        Authentication authentication = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        when(jwtUtils.generateJwtToken(user.getEmail())).thenReturn("jwt-token");

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals(user.getUsername(), response.getUser().getUsername());
        verify(authenticationManager, times(1)).authenticate(any());
    }

    @Test
    void login_ShouldThrowException_WhenUserNotFound() {
        LoginRequest request = new LoginRequest();
        request.setEmail("notfound@example.com");
        request.setPassword("password");

        Authentication authentication = mock(Authentication.class);

        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> authService.login(request));
    }

    @Test
    void register_ShouldReturnJwtResponse_WhenUserIsValid() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@example.com");
        request.setUsername("newuser");
        request.setPassword("password");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(userRepository.findByUsername(request.getUsername())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedpass");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtUtils.generateJwtToken(user.getEmail())).thenReturn("jwt-token");

        JwtResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals(user.getUsername(), response.getUser().getUsername());
    }

    @Test
    void register_ShouldThrowException_WhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setUsername("newuser");
        request.setPassword("password");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));

        assertThrows(RuntimeException.class, () -> authService.register(request));
    }

    @Test
    void register_ShouldThrowException_WhenUsernameAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@example.com");
        request.setUsername("testuser");
        request.setPassword("password");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(userRepository.findByUsername(request.getUsername())).thenReturn(Optional.of(user));

        assertThrows(RuntimeException.class, () -> authService.register(request));
    }

    @Test
    void update_ShouldUpdateUser_WhenDataIsValid() {
        UpdateRequest request = new UpdateRequest();
        request.setId(user.getId());
        request.setEmail("updated@example.com");
        request.setUsername("updateduser");
        request.setPassword("newpass");

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(userRepository.findByUsername(request.getUsername())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodednewpass");
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserResponse response = authService.update(request);

        assertNotNull(response);
        assertEquals(request.getEmail(), response.getEmail());
        assertEquals(request.getUsername(), response.getUsername());
    }

    @Test
    void update_ShouldThrowException_WhenUserNotFound() {
        UpdateRequest request = new UpdateRequest();
        request.setId(99L);
        request.setEmail("notfound@example.com");
        request.setUsername("nouser");
        request.setPassword("pass");

        when(userRepository.findById(request.getId())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> authService.update(request));
    }

    @Test
    void update_ShouldThrowException_WhenEmailAlreadyTaken() {
        UpdateRequest request = new UpdateRequest();
        request.setId(user.getId());
        request.setEmail("other@example.com");
        request.setUsername("updateduser");
        request.setPassword("newpass");

        User otherUser = new User();
        otherUser.setId(2L);
        otherUser.setEmail("other@example.com");

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(otherUser));

        assertThrows(RuntimeException.class, () -> authService.update(request));
    }

    @Test
    void update_ShouldThrowException_WhenUsernameAlreadyTaken() {
        UpdateRequest request = new UpdateRequest();
        request.setId(user.getId());
        request.setEmail("updated@example.com");
        request.setUsername("otheruser");
        request.setPassword("newpass");

        User otherUser = new User();
        otherUser.setId(2L);
        otherUser.setUsername("otheruser");

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(userRepository.findByUsername(request.getUsername())).thenReturn(Optional.of(otherUser));

        assertThrows(RuntimeException.class, () -> authService.update(request));
    }
}
