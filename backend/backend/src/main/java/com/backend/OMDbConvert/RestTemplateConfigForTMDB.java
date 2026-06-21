package com.backend.OMDbConvert;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfigForTMDB {

@Bean
    public RestTemplate restTemplate(){
    return new RestTemplate();
}
}
