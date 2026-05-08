package br.edu.ifpb.explorae.api.mapper;

import br.edu.ifpb.explorae.api.dto.UserResponseDTO;
import br.edu.ifpb.explorae.domain.user.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    
    @Mapping(target = "hasPreferences", expression = "java(user.getTravelPreference() != null && user.getTravelPreference().getInterests() != null && !user.getTravelPreference().getInterests().isEmpty())")
    UserResponseDTO toResponseDTO(User user);
}
