package br.edu.ifpb.explorae.user.dto;

import java.util.UUID;

public record CategoryResponseDTO(
    UUID id,
    String slug,
    String name,
    String iconName,
    String parentCategory
) {}
