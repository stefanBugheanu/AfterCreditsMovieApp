package com.backend.services.impl;

import com.backend.OMDbConvert.RestTemplateConfigForTMDB;
import com.backend.dtos.genre.GenreDto;
import com.backend.dtos.movie.CreateMovieRequestDto;
import com.backend.dtos.movie.MovieResponseDto;
import com.backend.dtos.movie.UpdateMovieRequestDto;
import com.backend.entities.Movie;
import com.backend.exceptions.movieExceptions.GenreNotFoundException;
import com.backend.exceptions.movieExceptions.MovieNotFoundException;
import com.backend.mapper.movie.MovieMapperImpl;
import com.backend.repositories.MovieRepository;
import com.backend.services.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {

    private final MovieMapperImpl mapper;

    private final MovieRepository movieRepository;

    private final RestTemplate restTemplate;

    @Value("${tmdb.api.key}")
    private String apiKey;

    private String getBackdropUrl(String title) {
        String url = "https://api.themoviedb.org/3/search/movie?api_key="
                + apiKey
                + "&query="
                + title;

        Map response = restTemplate.getForObject(url, Map.class);

        if (response == null) {
            return null;
        }

        List results = (List) response.get("results");

        if (results == null || results.isEmpty()) {
            return null;
        }

        Map firstMovie = (Map) results.get(0);

        String path = (String) firstMovie.get("backdrop_path");

        if (path == null) {
            return null;
        }

        return "https://image.tmdb.org/t/p/w1280" + path;
    }




    @Override
    public MovieResponseDto createMovie(CreateMovieRequestDto request){

        String backdropUrl  = getBackdropUrl(request.title());

    Movie movie = Movie.builder()
                .title(request.title())
                .genre(request.genre())
                .description(request.description())
                .backdropUrl(backdropUrl)
                .releaseYear(request.releaseYear())
                .duration(request.duration())
                .build();


    Movie savedMovie= movieRepository.save(movie);


    return mapper.toResponse(savedMovie);

    }

    @Override
    public MovieResponseDto getMovieById(UUID id){
        Movie dbMovie = movieRepository.findById(id).orElseThrow(() -> new MovieNotFoundException("Movie with the id: " + id + " doesn't exist"));

       return mapper.toResponse(dbMovie);

    }

    @Override
    public List<MovieResponseDto> getMovies(){
        List<Movie> movies= movieRepository.findAll();

        return movies.stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public MovieResponseDto updateMovie(UUID id, UpdateMovieRequestDto request ){

        Movie movie = movieRepository.findById(id).orElseThrow(()->new RuntimeException("Movie not found"));

        if(request.title()!=null){
            movie.setTitle(request.title());
        }
        if(request.genre()!=null){
            movie.setGenre(request.genre());
        }
        if(request.description()!=null){
            movie.setDescription(request.description());
        }if(request.releaseYear()!=null){

            movie.setReleaseYear(request.releaseYear());
        }if(request.duration()!=null){
            movie.setDuration(request.duration());
        }

        Movie savedMovie = movieRepository.save(movie);

        return mapper.toResponse(savedMovie);


    }

    @Override
    public void deleteMovie(UUID id){

        Movie movie= movieRepository.findById(id).orElseThrow(()->new RuntimeException("Movie not found"));

        movieRepository.delete(movie);


    }

    @Override
    public List<MovieResponseDto> searchByTitle(String title){

     if(title==null || title.isBlank()){
         return List.of();
     }

        Pageable pageable= PageRequest.of(0,4, Sort.by("title").ascending());

        Page<Movie> moviePage = movieRepository.findByTitleContainingIgnoreCase(title, pageable);

        return moviePage.map(mapper::toResponse).getContent();

    }

    @Override
    public List<MovieResponseDto> getHighestRatingMovies(){

        Pageable pageable= PageRequest.of(0,13, Sort.by("rating").descending());

        Page<Movie> moviePage= movieRepository.findAll(pageable);

        return moviePage.map(mapper::toResponse).getContent();

    }

    public List<GenreDto> getGenres(){

        return movieRepository.findGenresWithCounts();
    }

    @Override
    public List<MovieResponseDto> getTopRatedByGenre(String genre){

        if (genre == null || genre.isBlank()) {
            throw new GenreNotFoundException("The genre doesn't exist!");
        }

        Pageable pageable= PageRequest.of(0,10, Sort.by("rating").descending());
        Page<Movie> moviesByGenrePage = movieRepository.findByGenreIgnoreCase(genre, pageable);

        return moviesByGenrePage.map(mapper::toResponse).getContent();

    }


}
