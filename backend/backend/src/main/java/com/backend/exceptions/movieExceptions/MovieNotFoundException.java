package com.backend.exceptions.movieExceptions;

import com.backend.exceptions.ErrorResponse;

public class MovieNotFoundException extends RuntimeException{

    public MovieNotFoundException(String message){
        super(message);
    }
}
