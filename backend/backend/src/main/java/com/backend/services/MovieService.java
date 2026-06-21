package com.backend.services;

import com.backend.dtos.genre.GenreDto;
import com.backend.dtos.movie.CreateMovieRequestDto;
import com.backend.dtos.movie.MovieResponseDto;
import com.backend.dtos.movie.UpdateMovieRequestDto;
import com.backend.entities.Rating;

import java.awt.print.Pageable;
import java.util.List;
import java.util.UUID;

public interface MovieService {

        MovieResponseDto createMovie(CreateMovieRequestDto request);

        MovieResponseDto getMovieById(UUID id);

        List<MovieResponseDto> getMovies();

        MovieResponseDto updateMovie(UUID id, UpdateMovieRequestDto request );

        void deleteMovie(UUID id);

        List<MovieResponseDto> searchByTitle(String title);

        List<MovieResponseDto> getHighestRatingMovies();

        List<MovieResponseDto> getTopRatedByGenre(String genre);

        List<GenreDto> getGenres();
}
