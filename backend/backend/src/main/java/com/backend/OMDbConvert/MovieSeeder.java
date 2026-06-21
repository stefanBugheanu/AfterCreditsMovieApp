package com.backend.OMDbConvert;

import com.backend.entities.Movie;
import com.backend.repositories.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MovieSeeder implements CommandLineRunner {

    private final MovieRepository movieRepository;
    private final OmdbClient omdbClient;
    private final OmdbMapper omdbMapper;

    @Override
    public void run(String... args) {

        if (movieRepository.count() > 0) {
            return;
        }

        List<Movie> movies = MoviesByTitle.MOVIE_TITLES.stream()
                .map(omdbClient::getMovieByTitle)
                .filter(this::isValidResponse)
                .map(omdbMapper::convertToMovie)
                .toList();

        movieRepository.saveAll(movies);
    }

    private boolean isValidResponse(OmdbResponseDto dto) {

        return dto != null
                && "True".equalsIgnoreCase(dto.response())
                && dto.title() != null
                && !dto.title().isBlank();
    }
}