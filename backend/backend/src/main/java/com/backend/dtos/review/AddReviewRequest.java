package com.backend.dtos.review;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AddReviewRequest(
        @NotBlank
        @Size(max = 5000)
        String content
) {}
