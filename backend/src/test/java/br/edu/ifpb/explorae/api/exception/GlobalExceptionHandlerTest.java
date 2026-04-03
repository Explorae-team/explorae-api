package br.edu.ifpb.explorae.api.exception;

import br.edu.ifpb.explorae.api.dto.StandardResponseDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
    }

    @Test
    void shouldHandleBusinessException() {
        // Arrange
        BusinessException ex = new BusinessException("Erro de negócio");

        // Act
        ResponseEntity<StandardResponseDTO<Void>> response = exceptionHandler.handleBusinessException(ex);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Erro de negócio", response.getBody().message());
    }

    @Test
    void shouldHandleResourceNotFoundException() {
        // Arrange
        ResourceNotFoundException ex = new ResourceNotFoundException("Usuário não encontrado");

        // Act
        ResponseEntity<StandardResponseDTO<Void>> response = exceptionHandler.handleResourceNotFound(ex);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Usuário não encontrado", response.getBody().message());
    }

    @Test
    void shouldHandleNoHandlerFoundException() {
        // Arrange
        NoHandlerFoundException ex = new NoHandlerFoundException("GET", "/api/v1/fake", new HttpHeaders());

        // Act
        ResponseEntity<StandardResponseDTO<Void>> response = exceptionHandler.handleNoHandlerFound(ex);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Rota não encontrada: /api/v1/fake", response.getBody().message());
    }

    @Test
    void shouldHandleNoResourceFoundException() {
        // Arrange
        NoResourceFoundException ex = new NoResourceFoundException(HttpMethod.GET, "/api/v1/fake", "Falha na rota");

        // Act
        ResponseEntity<StandardResponseDTO<Void>> response = exceptionHandler.handleNoResourceFound(ex);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Recurso ou rota não encontrada.", response.getBody().message());
    }

    @Test
    void shouldHandleBadCredentialsException() {
        // Arrange
        BadCredentialsException ex = new BadCredentialsException("Bad creds");

        // Act
        ResponseEntity<StandardResponseDTO<Void>> response = exceptionHandler.handleBadCredentials(ex);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("E-mail ou senha inválidos.", response.getBody().message());
    }

    @Test
    void shouldHandleGeneralException() {
        // Arrange
        Exception ex = new Exception("Erro interno disparado");

        // Act
        ResponseEntity<StandardResponseDTO<Void>> response = exceptionHandler.handleGeneralExceptions(ex);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().message().contains("Erro interno disparado"));
    }
}
