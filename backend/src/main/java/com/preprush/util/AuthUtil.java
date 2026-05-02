package com.preprush.util;

import com.preprush.exception.UnauthorizedException;
import com.preprush.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public final class AuthUtil {

    private AuthUtil() {
    }

    public static Long getCurrentUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("Authentication is required");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof User user && user.getId() != null) {
            return user.getId();
        }

        throw new UnauthorizedException("Invalid authentication principal");
    }

    public static Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return getCurrentUserId(authentication);
    }

    public static String getCurrentUserEmail(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("Authentication is required");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            return userDetails.getUsername();
        }

        if (principal instanceof String username) {
            return username;
        }

        throw new UnauthorizedException("Invalid authentication principal");
    }
}
