package com.backend.controllers;

import com.backend.services.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ratings")
public class RatingController {
    private final RatingService service;

    @PostMapping("{movieId}")
    public ResponseEntity<Void> addRatingToMovie(@PathVariable UUID movieId,
                                                 @RequestParam int value){
        service.addRating(movieId, value);
        return ResponseEntity.ok().build();
    }

}
