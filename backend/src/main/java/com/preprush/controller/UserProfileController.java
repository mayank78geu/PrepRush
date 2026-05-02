package com.preprush.controller;

import com.preprush.dto.request.UpdateProfileRequest;
import com.preprush.dto.response.AuthResponse;
import com.preprush.service.UserProfileService;
import com.preprush.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    /** GET /api/profile — returns the current user's full profile */
    @GetMapping
    public ResponseEntity<AuthResponse.UserPayload> getProfile(Authentication authentication) {
        String email = AuthUtil.getCurrentUserEmail(authentication);
        return ResponseEntity.ok(userProfileService.getProfile(email));
    }

    /** PUT /api/profile — update name, academicLevel, academicDetails */
    @PutMapping
    public ResponseEntity<AuthResponse.UserPayload> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        String email = AuthUtil.getCurrentUserEmail(authentication);
        return ResponseEntity.ok(userProfileService.updateProfile(email, request));
    }
}
