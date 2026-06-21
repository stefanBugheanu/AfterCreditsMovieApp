package com.backend.dtos.watchlist;

import com.backend.dtos.movie.MovieSummaryDto;

import java.util.UUID;

public record WatchlistItemDto (

        UUID id,
        MovieSummaryDto movie
){
}
