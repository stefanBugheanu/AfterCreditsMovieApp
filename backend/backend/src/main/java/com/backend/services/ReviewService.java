package com.backend.services;

import com.backend.dtos.review.AddReviewRequest;

import java.util.UUID;

public interface ReviewService {

    void addReviewToMovie(UUID movieId, AddReviewRequest request);

    void deleteReview(UUID reviewId);


}
