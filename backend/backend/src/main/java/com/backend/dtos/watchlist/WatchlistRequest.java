package com.backend.dtos.watchlist;

import java.util.UUID;

public record WatchlistRequest(
        UUID movieId
) {
}
