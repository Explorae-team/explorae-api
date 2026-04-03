package br.edu.ifpb.explorae.api.dto;

public record AuthLoginResponseDTO(
    String token,
    UserResponseDTO user
) {}
