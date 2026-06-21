package com.backend.services.impl;

import com.backend.dtos.review.AddReviewRequest;
import com.backend.entities.Movie;
import com.backend.entities.Review;
import com.backend.entities.User;
import com.backend.entities.enums.RoleEnum;
import com.backend.exceptions.movieExceptions.MovieNotFoundException;
import com.backend.repositories.MovieRepository;
import com.backend.repositories.ReviewRepository;
import com.backend.repositories.UserRepository;
import com.backend.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;



    @Override
    public void addReviewToMovie(UUID movieId, AddReviewRequest request){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow(
                ()->new UsernameNotFoundException("User not found!")
        );
        Movie movie = movieRepository.findById(movieId).orElseThrow(
                ()->new MovieNotFoundException("Movie not found!")
        );


        if(reviewRepository.existsByUserAndMovie(user, movie)){
            throw new RuntimeException("You have already reviewed this movie!");
        }

        Review review= Review.builder()
                .movie(movie)
                .user(user)
                .content(request.content())
                .build();

        reviewRepository.save(review);

    }

    @Override
    public void deleteReview(UUID reviewId){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow(
                ()->new UsernameNotFoundException("User not found!")
        );

      Review reviewToDelete= reviewRepository.findById(reviewId).orElseThrow(
              ()->new RuntimeException("Review not found!")
      );
        if(user.getId().equals(reviewToDelete.getUser().getId()) || user.getRole()== RoleEnum.ADMIN){
            reviewRepository.delete(reviewToDelete);
        }else{
            throw new RuntimeException("You don't have permission to delete this review");
        }
    }



}
