package com.backend.services;

import com.backend.entities.Rating;

import java.util.UUID;

public interface RatingService {
    void addRating(UUID movieId, int value);

}
