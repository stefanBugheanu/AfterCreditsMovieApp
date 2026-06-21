package com.backend.services.impl;

import com.backend.entities.Movie;
import com.backend.entities.Rating;
import com.backend.entities.User;
import com.backend.exceptions.movieExceptions.MovieNotFoundException;
import com.backend.repositories.MovieRepository;
import com.backend.repositories.RatingRepository;
import com.backend.repositories.UserRepository;
import com.backend.services.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.parameters.P;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {
    private final RatingRepository ratingRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;


    @Transactional
    @Override
    public void addRating(UUID movieId, int value){
        String username= SecurityContextHolder.getContext().getAuthentication().getName();
        User user= userRepository.findByUsername(username).orElseThrow(
                ()->new UsernameNotFoundException("User not found!")
        );

        Movie movie = movieRepository.findById(movieId).orElseThrow(
                ()-> new MovieNotFoundException("Movie not found!")
        );

        if(ratingRepository.existsByUserAndMovie(user ,movie)){
            throw new RuntimeException("You already rated this movie!");
        }

        double oldAvg = movie.getRating();
        int n = movie.getNrRatings();
        if (value < 1 || value > 10) {
                throw new RuntimeException("Invalid rating!");
        }
        Rating rating = Rating.builder()
                .user(user)
                .movie(movie)
                .value(value)
                .build();

        ratingRepository.save(rating);

            int newValue = value;
            double newAvg = (oldAvg * n + newValue) / (n + 1);

            movie.setNrRatings(n+1);
            movie.setRating(newAvg);
            movieRepository.save(movie);


//            In rating practic salvam fiecare rating dat de user



    }
}
