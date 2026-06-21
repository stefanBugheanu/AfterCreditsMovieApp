package com.backend.services.impl;

import com.backend.dtos.movie.MovieSummaryDto;
import com.backend.dtos.user.UserRatingDto;
import com.backend.dtos.user.UserReviewDto;
import com.backend.dtos.user.UserStatsDto;
import com.backend.dtos.watchlist.WatchlistItemDto;
import com.backend.dtos.watchlist.WatchlistMovieResponse;
import com.backend.entities.Movie;
import com.backend.entities.User;
import com.backend.repositories.RatingRepository;
import com.backend.repositories.ReviewRepository;
import com.backend.repositories.UserRepository;
import com.backend.repositories.WatchlistRepository;
import com.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RatingRepository ratingRepository;
    private final ReviewRepository reviewRepository;
    private final WatchlistRepository watchlistRepository;

    @Override
    @Transactional(readOnly = true)
    public UserStatsDto getUserStats() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UsernameNotFoundException("User is not authenticated!");
        }

        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));

        UUID userId = user.getId();

        List<UserRatingDto> ratings = ratingRepository.findByUserId(userId)
                .stream()
                .map(rating -> new UserRatingDto(
                        rating.getId(),
                        rating.getValue(),
                        mapToMovieSummaryDto(rating.getMovie())
                ))
                .toList();

        List<UserReviewDto> reviews = reviewRepository.findByUserId(userId)
                .stream()
                .map(review -> new UserReviewDto(
                        review.getId(),
                        review.getContent(),
                        mapToMovieSummaryDto(review.getMovie())
                ))
                .toList();

        List<WatchlistItemDto> watchlist = watchlistRepository.findByUserId(userId)
                .stream()
                .map(watchlistItem -> {
                    Movie movie = watchlistItem.getMovie();

                 return new WatchlistItemDto(
                         watchlistItem.getId(),
                         mapToMovieSummaryDto(movie)
                 );
                })
                .toList();

        int filmsRated = (int) ratings.stream()
                .map(rating -> rating.movie().id())
                .distinct()
                .count();

        return UserStatsDto.builder()
                .username(user.getUsername())
                .filmsRated(filmsRated)
                .reviewsWritten(reviews.size())
                .watchlistCount(watchlist.size())
                .ratings(ratings)
                .reviews(reviews)
                .watchlist(watchlist)
                .build();
    }

    private MovieSummaryDto mapToMovieSummaryDto(Movie movie) {
        return new MovieSummaryDto(
                movie.getId(),
                movie.getTitle(),
                movie.getPosterUrl(),
                movie.getReleaseYear(),
                movie.getGenre(),
                movie.getDirector(),
                movie.getActors()
        );
    }
}