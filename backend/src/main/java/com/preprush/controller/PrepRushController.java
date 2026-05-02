package com.preprush.controller;

import com.preprush.dto.request.PrepRushGenerateRequest;
import com.preprush.dto.request.TopicDetailRequest;
import com.preprush.dto.response.PrepRushResponse;
import com.preprush.dto.response.TopicDetailResponse;
import com.preprush.service.PrepRushService;
import com.preprush.util.AuthUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/prep-rush")
public class PrepRushController {

    private final PrepRushService prepRushService;

    public PrepRushController(PrepRushService prepRushService) {
        this.prepRushService = prepRushService;
    }

    @PostMapping("/generate")
    public ResponseEntity<PrepRushResponse> generatePrepRush(
            @RequestBody PrepRushGenerateRequest request,
            Authentication authentication) {
        Long userId = AuthUtil.getCurrentUserId(authentication);
        PrepRushResponse response = prepRushService.generatePrepRush(request, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/topic-detail")
    public ResponseEntity<TopicDetailResponse> getTopicDetail(
            @RequestBody TopicDetailRequest request,
            Authentication authentication) {
        Long userId = AuthUtil.getCurrentUserId(authentication);
        TopicDetailResponse response = prepRushService.getTopicDetail(request, userId);
        return ResponseEntity.ok(response);
    }
}
