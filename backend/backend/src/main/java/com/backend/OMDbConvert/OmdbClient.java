package com.backend.OMDbConvert;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@Component
@RequiredArgsConstructor
public class OmdbClient {

    private final RestClient restClient = RestClient.create();

    @Value("${omdb.api.key}")
    private String apiKey;

    @Value("${omdb.api.url}")
    private String baseUrl;

    public OmdbResponseDto getMovieByTitle(String title) {
        URI uri = UriComponentsBuilder
                .fromUriString(baseUrl)
                .queryParam("apikey", apiKey)
                .queryParam("t", title)
                .queryParam("plot", "full")
                .encode()
                .build()
                .toUri();

        return restClient.get()
                .uri(uri)
                .retrieve()
                .body(OmdbResponseDto.class);
    }

}