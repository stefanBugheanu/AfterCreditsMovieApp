package com.backend.dtos.movie;


import lombok.Builder;

import java.util.List;
import java.util.UUID;

@Builder
public record MovieSummaryDto(
        UUID id,
        String title,
        String posterUrl,
        Integer releaseYear,
        String genre,
        String director,
        List<String> actors
) {
}
