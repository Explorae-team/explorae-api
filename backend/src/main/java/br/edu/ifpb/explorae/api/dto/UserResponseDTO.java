package br.edu.ifpb.explorae.api.dto;

import java.util.List;
import java.util.UUID;

public record UserResponseDTO(
    UUID id,
    String name,
    String email,
    String phone,
    String bio,
    String photoUrl,
    Integer xp,
    Integer level,
    Integer coins,
    String levelName,
    boolean hasPreferences,
    List<BadgeResponseDTO> badges
) {}
