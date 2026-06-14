package br.edu.ifpb.explorae.user.mapper;

import br.edu.ifpb.explorae.gamification.dto.BadgeResponseDTO;
import br.edu.ifpb.explorae.user.dto.UserResponseDTO;
import br.edu.ifpb.explorae.gamification.domain.Badge;
import br.edu.ifpb.explorae.gamification.domain.UserBadge;
import br.edu.ifpb.explorae.user.domain.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    
    @Mapping(target = "hasPreferences", expression = "java(user.getTravelPreference() != null && user.getTravelPreference().getInterests() != null && !user.getTravelPreference().getInterests().isEmpty())")
    @Mapping(target = "badges", expression = "java(mapBadges(user.getUserBadges()))")
    @Mapping(target = "levelName", expression = "java(calculateLevelName(user.getXp()))")
    UserResponseDTO toResponseDTO(User user);

    default String calculateLevelName(Integer xp) {
        return br.edu.ifpb.explorae.gamification.util.GamificationRules.getLevelName(xp);
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
