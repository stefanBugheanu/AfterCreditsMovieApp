package com.backend.dtos.movie;

import jakarta.validation.constraints.*;

public record UpdateMovieRequestDto(

        @NotBlank(message = TITLE_EXCEPTION_MESSAGE)
        @Size(max=100)
        String title,

        @NotNull(message = GENRE_EXCEPTION_MESSAGE)
        String genre,

        @NotBlank
        String description,

        @Max(value = 2026, message = YEAR_EX_MESSAGE)
        Integer releaseYear,

        @Positive
        Integer duration


) {

    private static final String TITLE_EXCEPTION_MESSAGE= "The title is not here!";

    private static final String GENRE_EXCEPTION_MESSAGE= "This is not a genre!";

    private static final String YEAR_EX_MESSAGE= "The year must be relevant";


}
