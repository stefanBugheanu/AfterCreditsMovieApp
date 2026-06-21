package com.backend.exceptions;

import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public class ErrorResponse{
    private LocalDateTime timestamp;

    private String message;

    private String error;

    private HttpStatus status;

    public ErrorResponse(LocalDateTime timestamp, String message, String error, HttpStatus status){
        this.timestamp = timestamp;
        this.message = message;
        this.error = error;
        this.status = status;
    }

}
