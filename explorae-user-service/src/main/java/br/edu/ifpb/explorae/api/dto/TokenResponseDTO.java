package br.edu.ifpb.explorae.api.dto;

public record TokenResponseDTO(
        String token,
        String type
) {
    public TokenResponseDTO(String token) {
        this(token, "Bearer");
    }
}
