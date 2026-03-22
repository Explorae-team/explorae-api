package br.edu.ifpb.explorae.api.mapper;

import br.edu.ifpb.explorae.api.dto.UserResponseDTO;
import br.edu.ifpb.explorae.domain.user.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    
    UserResponseDTO toResponseDTO(User user);
}
