package br.edu.ifpb.explorae.api.mapper;

import br.edu.ifpb.explorae.api.dto.BadgeResponseDTO;
import br.edu.ifpb.explorae.api.dto.UserResponseDTO;
import br.edu.ifpb.explorae.domain.gamification.Badge;
import br.edu.ifpb.explorae.domain.gamification.UserBadge;
import br.edu.ifpb.explorae.domain.user.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {
    
    @Mapping(target = "hasPreferences", expression = "java(user.getTravelPreference() != null && user.getTravelPreference().getInterests() != null && !user.getTravelPreference().getInterests().isEmpty())")
    @Mapping(target = "badges", expression = "java(mapBadges(user.getUserBadges()))")
    @Mapping(target = "levelName", expression = "java(calculateLevelName(user.getXp()))")
    UserResponseDTO toResponseDTO(User user);

    default String calculateLevelName(Integer xp) {
        if (xp == null) return "Explorador Bronze";
        if (xp < 1000) return "Explorador Bronze";
        if (xp < 2000) return "Explorador Prata";
        if (xp < 3000) return "Explorador Ouro";
        return "Explorador Platina";
    }

    default List<BadgeResponseDTO> mapBadges(List<UserBadge> userBadges) {
        if (userBadges == null) return Collections.emptyList();
        return userBadges.stream()
                .map(ub -> toBadgeDTO(ub.getBadge()))
                .collect(Collectors.toList());
    }

    @Mapping(target = "id", source = "id")
    BadgeResponseDTO toBadgeDTO(Badge badge);
}
