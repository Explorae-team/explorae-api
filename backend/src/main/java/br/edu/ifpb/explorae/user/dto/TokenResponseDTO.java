package br.edu.ifpb.explorae.user.dto;

public record TokenResponseDTO(
        String token,
        String type) {
    public TokenResponseDTO(String token) {
        this(token, "Bearer");
    }
}
