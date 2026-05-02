package com.preprush.controller;

import com.preprush.dto.response.AnalyticsResponse;
import com.preprush.service.AnalyticsService;
import com.preprush.util.AuthUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public ResponseEntity<AnalyticsResponse> getAnalytics(Authentication authentication) {
        Long userId = AuthUtil.getCurrentUserId(authentication);
        AnalyticsResponse response = analyticsService.getAnalytics(userId);
        return ResponseEntity.ok(response);
    }
}
