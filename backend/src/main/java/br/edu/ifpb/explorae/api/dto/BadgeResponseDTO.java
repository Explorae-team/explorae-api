package br.edu.ifpb.explorae.api.dto;

import java.util.UUID;

public record BadgeResponseDTO(
    UUID id,
    String name,
    String description,
    String iconUrl,
    String category,
    Integer currentValue,
    Integer targetValue
) {
    public BadgeResponseDTO(UUID id, String name, String description, String iconUrl, String category) {
        this(id, name, description, iconUrl, category, null, null);
    }
}
