package com.backend.controllers;

import com.backend.dtos.review.AddReviewRequest;
import com.backend.services.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService service;

    @PostMapping("/{movieId}")
    public ResponseEntity<Void> addReview(
            @PathVariable UUID movieId,
            @Valid @RequestBody AddReviewRequest request){

        service.addReviewToMovie(movieId, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable UUID reviewId){

        service.deleteReview(reviewId);
        return ResponseEntity.ok().build();

    }
}


