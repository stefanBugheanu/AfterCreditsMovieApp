package com.backend.services;

import com.backend.dtos.watchlist.WatchlistMovieResponse;
import com.backend.dtos.watchlist.WatchlistRequest;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface WatchlistService {

    List<WatchlistMovieResponse> getWatchlist(String sortBy);

    WatchlistMovieResponse addToWatchlist(WatchlistRequest request);

    void deleteMovieFromWatchlist(UUID id);


}
