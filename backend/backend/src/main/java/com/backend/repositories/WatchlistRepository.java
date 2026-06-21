package com.backend.repositories;

import com.backend.dtos.watchlist.WatchlistMovieResponse;
import com.backend.entities.Movie;
import com.backend.entities.User;
import com.backend.entities.WatchlistMovie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WatchlistRepository extends JpaRepository<WatchlistMovie, UUID> {

    List<WatchlistMovie> findByUser(User user, Sort sort);

    Optional<WatchlistMovie> findByUserAndMovie(User user, Movie movie);

    boolean existsByUserAndMovie(User user, Movie movie);

    List<WatchlistMovie> findByUserId(UUID id);

}
