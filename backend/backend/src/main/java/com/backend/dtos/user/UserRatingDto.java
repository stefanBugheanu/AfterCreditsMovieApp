package com.backend.dtos.user;


import com.backend.dtos.movie.MovieSummaryDto;
import lombok.Builder;

import java.util.UUID;

@Builder
public record UserRatingDto(
        UUID id,
        double value,
        MovieSummaryDto movie
) {


}
