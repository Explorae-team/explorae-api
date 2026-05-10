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
    UserResponseDTO toResponseDTO(User user);

    default List<BadgeResponseDTO> mapBadges(List<UserBadge> userBadges) {
        if (userBadges == null) return Collections.emptyList();
        return userBadges.stream()
                .map(ub -> toBadgeDTO(ub.getBadge()))
                .collect(Collectors.toList());
    }

    @Mapping(target = "id", source = "id")
    BadgeResponseDTO toBadgeDTO(Badge badge);
}
