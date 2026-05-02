package com.preprush.service;

import com.preprush.dto.request.LoginRequest;
import com.preprush.dto.request.RegisterRequest;
import com.preprush.dto.response.AuthResponse;
import com.preprush.exception.UnauthorizedException;
import com.preprush.model.User;
import com.preprush.repository.UserRepository;
import java.util.Optional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService implements UserDetailsService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        try {
            Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
            if (existingUser.isPresent()) {
                throw new UnauthorizedException("Email already registered");
            }

            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

            User savedUser = userRepository.save(user);
            String token = jwtService.generateToken(savedUser);
            return new AuthResponse(token, toUserPayload(savedUser));
        } catch (UnauthorizedException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new RuntimeException("Failed to register user", ex);
        }
    }

    public AuthResponse login(LoginRequest request) {
        try {
            User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

            boolean matches = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
            if (!matches) {
                throw new UnauthorizedException("Invalid email or password");
            }

            String token = jwtService.generateToken(user);
            return new AuthResponse(token, toUserPayload(user));
        } catch (UnauthorizedException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new RuntimeException("Failed to login user", ex);
        }
    }

    public AuthResponse.UserPayload getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return toUserPayload(user);
    }

    private AuthResponse.UserPayload toUserPayload(User user) {
        return new AuthResponse.UserPayload(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getAcademicLevel(),
            user.getAcademicDetails()
        );
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
