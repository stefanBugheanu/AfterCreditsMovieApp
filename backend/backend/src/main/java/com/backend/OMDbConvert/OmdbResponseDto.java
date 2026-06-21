package com.backend.OMDbConvert;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OmdbResponseDto(

        @JsonProperty("Title")
        String title,

        @JsonProperty("Genre")
        String genre,

        @JsonProperty("Year")
        String year,

        @JsonProperty("Plot")
        String plot,
        @JsonProperty("Runtime")
        String runtime,

        @JsonProperty("Poster")
        String poster,

        @JsonProperty("Response")
        String response,

        @JsonProperty("Error")
        String error,

        @JsonProperty("Director")
        String director,

        @JsonProperty("Actors")
        String actors

) {
}