package com.backend.controllers;


import com.backend.dtos.genre.GenreDto;
import com.backend.dtos.movie.UpdateMovieRequestDto;
import com.backend.services.MovieService;
import com.backend.dtos.movie.CreateMovieRequestDto;
import com.backend.dtos.movie.MovieResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;


@GetMapping("{id}")
    public ResponseEntity<MovieResponseDto> getMovieByID(@PathVariable UUID id){

            MovieResponseDto response = movieService.getMovieById(id);

            return new ResponseEntity<>(response, HttpStatus.OK);

}

@GetMapping
    public ResponseEntity<List<MovieResponseDto>> getMovies(){

    List<MovieResponseDto> movies= movieService.getMovies();

    return new ResponseEntity<>(movies, HttpStatus.OK);
}



@GetMapping("/search")
public ResponseEntity<List<MovieResponseDto>> getMovieByTitle(@RequestParam String title){

    return ResponseEntity.ok(movieService.searchByTitle(title));

}

@GetMapping("/genres")
public ResponseEntity<List<GenreDto>> getGenres(){

    return ResponseEntity.ok(movieService.getGenres());
}

@GetMapping("/topRated")
    public ResponseEntity<List<MovieResponseDto>> getTopRatedMovies(){
    return ResponseEntity.ok(movieService.getHighestRatingMovies());
}

@GetMapping("/genre/topRated/{genre}")
    public ResponseEntity<List<MovieResponseDto>> getTopRatedByGenre(@PathVariable String genre){
    return ResponseEntity.ok(movieService.getTopRatedByGenre(genre));

}


}


