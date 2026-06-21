package com.backend.entities;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "movies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Movie {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "title" , nullable = false)
    private String title;

    @Column
    private String genre;

    @Column(name = "description", nullable = false, length = 5000)
    private String description;

    @Column(name = "release_year", nullable = false)
    private int releaseYear;

    @Column(name="poster_url")
    private String posterUrl;

    @Column(name="backdrop_url")
    private String backdropUrl;

    @Column(name="duration", nullable = false)
    private int duration;

    @Column(name="rating")
    private double rating;

    @Column(name = "nr_ratings")
    private int nrRatings;

    @Column
    private String director;

    @Column(length = 2000)
    private List<String> actors;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
    private List<Review> reviews;






}
