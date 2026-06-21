package com.backend.services.impl;

import com.backend.dtos.watchlist.WatchlistMovieResponse;
import com.backend.dtos.watchlist.WatchlistRequest;
import com.backend.entities.Movie;
import com.backend.entities.User;
import com.backend.entities.WatchlistMovie;
import com.backend.exceptions.movieExceptions.MovieNotFoundException;
import com.backend.mapper.movie.MovieMapper;
import com.backend.repositories.MovieRepository;
import com.backend.repositories.UserRepository;
import com.backend.repositories.WatchlistRepository;
import com.backend.services.WatchlistService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class WatchlistServiceImpl implements WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final MovieMapper mapper;

    private User getAuthenticatedUser(){
        var auth = SecurityContextHolder.getContext().getAuthentication();
       String username= SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("NAME = " + auth.getName());
        System.out.println("AUTHORITIES = " + auth.getAuthorities());
       return userRepository.findByUsername(username)
               .orElseThrow(()->new UsernameNotFoundException("User not found!"));
    }


//    Daca vrei alta directie pentru sortare mai pui un String parametru si verifica daca e ASC sau DESC


    @Override
    public List<WatchlistMovieResponse> getWatchlist(String sortBy){
        User user = getAuthenticatedUser();

        Sort sort = (sortBy == null || sortBy.isEmpty())
                ? Sort.by(Sort.Direction.DESC, "movie.rating")
                : Sort.by(Sort.Direction.DESC, "movie." + sortBy);

        return watchlistRepository.findByUser(user, sort).stream()
                .map(mapper::toResponse)
                .toList();    }

    @Override
    public WatchlistMovieResponse addToWatchlist(WatchlistRequest request){
        User user =getAuthenticatedUser();
        Movie movie= movieRepository.findById(request.movieId()).orElseThrow(()->new MovieNotFoundException("Didn't find the movie"));

        if(watchlistRepository.existsByUserAndMovie(user, movie)){
//            TODO Add an exception for Duplicates here
           throw new RuntimeException("Movie already exists in the watchlist");
        }

        WatchlistMovie watchlistMovie = WatchlistMovie.builder()
                .movie(movie)
                .user(user)
                .build();

        WatchlistMovie savedMovie = watchlistRepository.save(watchlistMovie);

        return mapper.toResponse(savedMovie);
    }

        @Override
        public void deleteMovieFromWatchlist(UUID movieId){
                User user= getAuthenticatedUser();

                Movie movie = movieRepository.findById(movieId).
                        orElseThrow(()->new MovieNotFoundException("Movie not found"));

                WatchlistMovie movieToDelete= watchlistRepository.findByUserAndMovie(user, movie).orElseThrow(
                        ()->new MovieNotFoundException("Movie is not in your watchlist")
                );

                watchlistRepository.delete(movieToDelete);

        }
}
