package com.sweetshop.service;

import com.sweetshop.dto.AuthDTO;
import com.sweetshop.entity.User;
import com.sweetshop.repository.UserRepository;
import com.sweetshop.security.CustomUserDetailsService;
import com.sweetshop.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @InjectMocks
    private AuthService authService;

    @Test
    void testRegisterSuccess() {
        AuthDTO.RegisterRequest request = new AuthDTO.RegisterRequest();
        request.setUsername("testuser");
        request.setPassword("password");

        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);
        when(userDetailsService.loadUserByUsername("testuser")).thenReturn(mock(UserDetails.class));
        when(jwtUtil.generateToken(any(UserDetails.class))).thenReturn("token");

        AuthDTO.AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("testuser", response.getUsername());
        assertEquals("token", response.getToken());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterUserAlreadyExists() {
        AuthDTO.RegisterRequest request = new AuthDTO.RegisterRequest();
        request.setUsername("existinguser");
        request.setPassword("password");

        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testLoginSuccess() {
        AuthDTO.LoginRequest request = new AuthDTO.LoginRequest();
        request.setUsername("testuser");
        request.setPassword("password");

        UserDetails userDetails = mock(UserDetails.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);
        when(userDetailsService.loadUserByUsername("testuser")).thenReturn(userDetails);
        when(jwtUtil.generateToken(userDetails)).thenReturn("token");

        AuthDTO.AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("testuser", response.getUsername());
        assertEquals("token", response.getToken());
    }
}
