package br.edu.ifpb.explorae.api.mapper;

import br.edu.ifpb.explorae.api.dto.BadgeResponseDTO;
import br.edu.ifpb.explorae.domain.gamification.Badge;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BadgeMapper {

    @Mapping(target = "id", source = "id")
    BadgeResponseDTO toBadgeDTO(Badge badge);

    List<BadgeResponseDTO> toBadgeDTOList(List<Badge> badges);
}
