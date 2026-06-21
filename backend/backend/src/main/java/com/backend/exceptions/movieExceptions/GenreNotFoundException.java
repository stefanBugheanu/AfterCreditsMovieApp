package com.backend.exceptions.movieExceptions;

public class GenreNotFoundException extends RuntimeException {
    public GenreNotFoundException(String message){
        super(message);
    }
}
