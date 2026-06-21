package com.backend.controllers;

import com.backend.dtos.watchlist.WatchlistMovieResponse;
import com.backend.dtos.watchlist.WatchlistRequest;
import com.backend.services.WatchlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequiredArgsConstructor
@RequestMapping("api/watchlist")
public class WatchlistController {
    private final WatchlistService service;

        @PostMapping
        public ResponseEntity<WatchlistMovieResponse> addToWatchlist(@RequestBody WatchlistRequest request){
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(service.addToWatchlist(request));
        }

    @DeleteMapping("{movieId}")
    public ResponseEntity<Void> deleteFromWatchlist(@PathVariable UUID movieId){
            service.deleteMovieFromWatchlist(movieId);

            return ResponseEntity.noContent().build();

    }

    @GetMapping
    public ResponseEntity<List<WatchlistMovieResponse>> getWatchlistMovies(@RequestParam(required = false , defaultValue = "0") int pageNumber,
                                                                           @RequestParam(required = false , defaultValue = "10")int size,
                                                                           @RequestParam(required = false) String sortBy){
        return ResponseEntity.ok(service.getWatchlist(sortBy));
    }



}
