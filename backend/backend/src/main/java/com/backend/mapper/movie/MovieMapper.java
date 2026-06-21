package com.backend.mapper.movie;

import com.backend.dtos.movie.MovieResponseDto;
import com.backend.dtos.watchlist.WatchlistMovieResponse;
import com.backend.entities.Movie;
import com.backend.entities.WatchlistMovie;

public interface MovieMapper {

    MovieResponseDto toResponse(Movie movie);

    WatchlistMovieResponse toResponse(WatchlistMovie watchlistMovie);
}
