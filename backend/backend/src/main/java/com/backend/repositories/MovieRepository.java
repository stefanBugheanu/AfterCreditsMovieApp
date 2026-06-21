package com.backend.repositories;

import com.backend.dtos.genre.GenreDto;
import com.backend.entities.Movie;
import com.backend.entities.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface MovieRepository extends JpaRepository<Movie, UUID> {
    Page<Movie> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    Page<Movie> findByGenreIgnoreCase(String genre, Pageable pageable);

    @Query("SELECT new com.backend.dtos.genre.GenreDto(m.genre, COUNT(m)) " +
            "FROM Movie m " +
            "WHERE m.genre IS NOT NULL " +
            "GROUP BY m.genre " +
            "ORDER BY COUNT(m) DESC")
    List<GenreDto> findGenresWithCounts();
}
