package com.backend.repositories;

import com.backend.entities.Movie;
import com.backend.entities.Review;
import com.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    boolean existsByUserAndMovie(User user, Movie movie);

    List<Review> findByUserId(UUID id);


}
