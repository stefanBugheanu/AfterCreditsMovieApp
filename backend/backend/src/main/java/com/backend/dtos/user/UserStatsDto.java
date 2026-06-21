package com.backend.dtos.user;

import com.backend.dtos.watchlist.WatchlistItemDto;
import lombok.Builder;

import java.util.List;

@Builder
public record UserStatsDto(
         String username,
         int filmsRated,
         int reviewsWritten,
         int watchlistCount,
         List<UserRatingDto> ratings,
         List<UserReviewDto> reviews,
         List<WatchlistItemDto> watchlist



) {
}
