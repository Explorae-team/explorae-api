package br.edu.ifpb.explorae.api.dto;

import java.util.UUID;

public record CategoryResponseDTO(
    UUID id,
    String slug,
    String name,
    String iconName
) {}
