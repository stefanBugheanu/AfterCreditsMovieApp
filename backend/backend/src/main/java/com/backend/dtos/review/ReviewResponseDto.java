package com.backend.dtos.review;

import java.util.UUID;

public record ReviewResponseDto(
        UUID id,
        String content,
        String username   // just the username, NOT the whole User
) {}