package com.backend.dtos.user;

import com.backend.dtos.movie.MovieSummaryDto;

import java.util.UUID;

public record UserReviewDto(
        UUID id,
        String content,
        MovieSummaryDto movie
) {}