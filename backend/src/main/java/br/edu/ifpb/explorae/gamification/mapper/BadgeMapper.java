package br.edu.ifpb.explorae.gamification.mapper;

import br.edu.ifpb.explorae.gamification.dto.BadgeResponseDTO;
import br.edu.ifpb.explorae.gamification.domain.Badge;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BadgeMapper {

    @Mapping(target = "id", source = "id")
    BadgeResponseDTO toBadgeDTO(Badge badge);

    List<BadgeResponseDTO> toBadgeDTOList(List<Badge> badges);
}
