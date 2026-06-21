package com.backend.repositories;

import com.backend.entities.Movie;
import com.backend.entities.Rating;
import com.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RatingRepository extends JpaRepository<Rating, UUID> {

    boolean existsByUserAndMovie(User user, Movie movie);

    List<Rating> findByUserId(UUID id);

}
