package com.backend.mapper.movie;

import com.backend.dtos.movie.MovieResponseDto;
import com.backend.dtos.review.ReviewResponseDto;
import com.backend.dtos.watchlist.WatchlistMovieResponse;
import com.backend.entities.Movie;
import com.backend.entities.WatchlistMovie;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
public class MovieMapperImpl implements MovieMapper{
    @Override
    public MovieResponseDto toResponse(Movie movie){
        if(movie == null){
            return null;

        }
        List<ReviewResponseDto> reviewDtos = movie.getReviews().stream()
                .map(r -> new ReviewResponseDto(
                        r.getId(),
                        r.getContent(),
                        r.getUser().getUsername()
                ))
                .toList();


        return new MovieResponseDto(
                movie.getId(),
                movie.getTitle(),
                movie.getGenre(),
                movie.getDescription(),
                movie.getReleaseYear(),
                movie.getPosterUrl(),
                movie.getBackdropUrl(),
                movie.getDuration(),
                movie.getRating(),
                movie.getNrRatings(),
                movie.getDirector(),
                movie.getActors(),
                reviewDtos
        );

    }

    @Override
    public WatchlistMovieResponse toResponse(WatchlistMovie watchlistMovie){
        Movie movie= watchlistMovie.getMovie();
            if(movie==null){
                return null;
            }

            return new WatchlistMovieResponse(
                    watchlistMovie.getId(),
                    movie.getId(),
                    movie.getTitle(),
                    movie.getGenre(),
                    movie.getPosterUrl(),
                    movie.getReleaseYear(),
                    movie.getDuration(),
                    movie.getRating(),
                    movie.getNrRatings(),
                    movie.getDirector(),
                    movie.getActors());
            }
}
