package com.moviehub.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFound(
            ResourceNotFoundException ex) {

        return new ResponseEntity<>(
                ex.getMessage(),
                HttpStatus.NOT_FOUND);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGenericException(
            Exception ex) {

        return new ResponseEntity<>(
                ex.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @ExceptionHandler(ResourceAlreadyExistsException.class)
public ResponseEntity<String> handleResourceAlreadyExists(
        ResourceAlreadyExistsException ex) {

    return new ResponseEntity<>(
            ex.getMessage(),
            HttpStatus.BAD_REQUEST);
}
@ExceptionHandler(InvalidCredentialsException.class)
public ResponseEntity<String> handleInvalidCredentials(
        InvalidCredentialsException ex) {

    return new ResponseEntity<>(
            ex.getMessage(),
            HttpStatus.UNAUTHORIZED);
}

}