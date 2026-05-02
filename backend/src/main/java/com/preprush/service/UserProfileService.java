package com.preprush.service;

import com.preprush.dto.request.UpdateProfileRequest;
import com.preprush.dto.response.AuthResponse;
import com.preprush.model.User;
import com.preprush.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserProfileService {

    private final UserRepository userRepository;

    public UserProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /** Return the profile for the authenticated user. */
    public AuthResponse.UserPayload getProfile(String email) {
        User user = findUser(email);
        return toPayload(user);
    }

    /** Update name / academicLevel / academicDetails – only non-null fields are applied. */
    @Transactional
    public AuthResponse.UserPayload updateProfile(String email, UpdateProfileRequest request) {
        User user = findUser(email);

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getAcademicLevel() != null) {
            user.setAcademicLevel(request.getAcademicLevel());
        }
        if (request.getAcademicDetails() != null) {
            user.setAcademicDetails(request.getAcademicDetails());
        }

        User saved = userRepository.save(user);
        return toPayload(saved);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    private AuthResponse.UserPayload toPayload(User u) {
        return new AuthResponse.UserPayload(
            u.getId(),
            u.getName(),
            u.getEmail(),
            u.getAcademicLevel(),
            u.getAcademicDetails()
        );
    }
}
