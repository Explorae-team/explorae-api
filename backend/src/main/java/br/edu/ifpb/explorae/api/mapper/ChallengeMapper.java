package br.edu.ifpb.explorae.api.mapper;

import br.edu.ifpb.explorae.api.dto.ChallengeProgressDTO;
import br.edu.ifpb.explorae.domain.gamification.UserChallengeProgress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ChallengeMapper {

    @Mapping(target = "id", source = "challenge.id")
    @Mapping(target = "title", source = "challenge.title")
    @Mapping(target = "description", source = "challenge.description")
    @Mapping(target = "type", source = "challenge.type")
    @Mapping(target = "actionType", source = "challenge.actionType")
    @Mapping(target = "targetValue", source = "challenge.targetValue")
    @Mapping(target = "xpReward", source = "challenge.xpReward")
    @Mapping(target = "coinsReward", source = "challenge.coinsReward")
    @Mapping(target = "startDate", source = "challenge.startDate")
    @Mapping(target = "endDate", source = "challenge.endDate")
    ChallengeProgressDTO toProgressDTO(UserChallengeProgress progress);

    List<ChallengeProgressDTO> toProgressDTOList(List<UserChallengeProgress> progressList);
}
