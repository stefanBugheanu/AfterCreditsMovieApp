package com.backend.dtos.watchlist;

import com.backend.entities.Review;

import java.util.List;
import java.util.UUID;


public record WatchlistMovieResponse (
        UUID watchlistId,
        UUID movieId,

        String title,

        String genre,
        String posterUrl,
        int releaseYear,

        int duration,

        double rating,
        int nrRatings,

        String director,

        List<String> actors


){
}
