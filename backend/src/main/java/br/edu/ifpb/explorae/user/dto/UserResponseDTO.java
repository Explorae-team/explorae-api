package br.edu.ifpb.explorae.user.dto;
import br.edu.ifpb.explorae.gamification.dto.BadgeResponseDTO;

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
    List<BadgeResponseDTO> badges,
    Integer checkInCount,
    Integer activeChallengesCount
) {
    public UserResponseDTO(UUID id, String name, String email, String phone, String bio, String photoUrl, Integer xp, Integer level, Integer coins, String levelName, boolean hasPreferences, List<BadgeResponseDTO> badges) {
        this(id, name, email, phone, bio, photoUrl, xp, level, coins, levelName, hasPreferences, badges, 0, 0);
    }
}
