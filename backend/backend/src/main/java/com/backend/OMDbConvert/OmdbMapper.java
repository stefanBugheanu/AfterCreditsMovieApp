package com.backend.OMDbConvert;

import com.backend.entities.Movie;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OmdbMapper {

    private final RestTemplate restTemplate;

    @Value("${tmdb.api.key}")
    private String apiKey;

    private String getBackdropUrl(String title) {
        String encodedTitle = URLEncoder.encode(title, StandardCharsets.UTF_8);

        String url = "https://api.themoviedb.org/3/search/movie?api_key="
                + apiKey
                + "&query="
                + encodedTitle;

        Map response = restTemplate.getForObject(url, Map.class);
        

        if (response == null) {
            return null;
        }

        List results = (List) response.get("results");

        if (results == null || results.isEmpty()) {
            return null;
        }

        Map firstMovie = (Map) results.get(0);

        String path = (String) firstMovie.get("backdrop_path");

        System.out.println("BACKDROP PATH: " + path);

        if (path == null) {
            return null;
        }

        return "https://image.tmdb.org/t/p/w1280" + path;
    }

    private List<String> parseActors(String actors){
        if(actors.isBlank()|| actors.isEmpty()){
            return List.of();
        }

        return List.of(actors.split(", "))
                .stream()
                .map(String::trim)
                .collect(Collectors.toList());
    }

    private static final DateTimeFormatter RELEASED_FORMATTER =
            DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH);

    public Movie convertToMovie(OmdbResponseDto dto) {
        String backdropUrl= getBackdropUrl(safeText(dto.title()));

        return Movie.builder()
                .title(safeText(dto.title()))
                .genre(getGenre(dto.genre()))
                .backdropUrl(backdropUrl)
                .description(safeText(dto.plot()))
                .releaseYear(parseYear(dto.year()))
                .posterUrl(parsePoster(dto.poster()))
                .director(safeText(dto.director()))
                .actors(parseActors(dto.actors()))
                .duration(parseDuration(dto.runtime()))
                .rating(0)
                .nrRatings(0)
                .reviews(null)
                .build();
    }

    private int parseYear(String year) {
        if (year == null || year.isBlank() || year.equalsIgnoreCase("N/A")) {
            return 0;
        }

        try {
            return Integer.parseInt(year.substring(0, 4));
        } catch (Exception e) {
            return 0;
        }
    }

    private int parseDuration(String runtime) {
        if (runtime == null || runtime.isBlank() || runtime.equalsIgnoreCase("N/A")) {
            return 0;
        }

        try {
            return Integer.parseInt(runtime.replace(" min", "").trim());
        } catch (Exception e) {
            return 0;
        }
    }

    private String parsePoster(String poster) {
        if (poster == null || poster.isBlank() || poster.equalsIgnoreCase("N/A")) {
            return null;
        }
        return poster;
    }

    private String getGenre(String genre){
        if(genre!=null && genre.contains(","))
            genre = genre.split(",")[0].trim();

        return genre;
    }

    private String safeText(String value) {
        if (value == null || value.isBlank() || value.equalsIgnoreCase("N/A")) {
            return "";
        }
        return value;
    }
}