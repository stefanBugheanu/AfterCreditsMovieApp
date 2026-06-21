package com.backend.controllers.adminOnly;


import com.backend.dtos.movie.CreateMovieRequestDto;
import com.backend.dtos.movie.MovieResponseDto;
import com.backend.dtos.movie.UpdateMovieRequestDto;
import com.backend.services.MovieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/admin")
public class AdminMovieController {

    private final MovieService movieService;


    @PostMapping
    public ResponseEntity<MovieResponseDto> createMovie(@Valid @RequestBody CreateMovieRequestDto request){

        MovieResponseDto response= movieService.createMovie(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);

    }

    @PatchMapping("{id}")

    public ResponseEntity<MovieResponseDto> updateMovie(@PathVariable UUID id , @Valid @RequestBody UpdateMovieRequestDto request){

        MovieResponseDto response= movieService.updateMovie(id, request);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @DeleteMapping("admin/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable UUID id){

        movieService.deleteMovie(id);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
