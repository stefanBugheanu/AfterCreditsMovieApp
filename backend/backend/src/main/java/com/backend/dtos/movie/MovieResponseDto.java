package com.backend.dtos.movie;

import com.backend.dtos.review.ReviewResponseDto;
import com.backend.entities.Review;
import lombok.Builder;

import java.util.List;
import java.util.UUID;


@Builder
public record MovieResponseDto(


        UUID id,

        String title,


        String genre,

        String description,

        int releaseYear,

        String posterUrl,

        String backdropUrl,

        int duration,

        double rating,
        int nrRatings,
        String director,
        List<String> actors,

        List<ReviewResponseDto> reviews




) {



}
