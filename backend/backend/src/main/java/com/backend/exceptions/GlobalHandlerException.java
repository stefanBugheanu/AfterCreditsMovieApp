package com.backend.exceptions;


import com.backend.exceptions.movieExceptions.GenreNotFoundException;
import com.backend.exceptions.movieExceptions.MovieNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalHandlerException {

    @ExceptionHandler(MovieNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleMovieNotFound(MovieNotFoundException exception){

        ErrorResponse errorResponse = new ErrorResponse(LocalDateTime.now(),
                exception.getMessage(),
                "MovieNotFoundException",
                HttpStatus.NOT_FOUND);

        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);

    }

    @ExceptionHandler(GenreNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotTitleFound(GenreNotFoundException ex){
        ErrorResponse error = new ErrorResponse(LocalDateTime.now(),
                ex.getMessage(),
                "GenreNotFoundException",
                HttpStatus.NOT_FOUND);

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);

    }

}
