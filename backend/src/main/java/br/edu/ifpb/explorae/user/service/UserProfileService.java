package br.edu.ifpb.explorae.user.service;

import br.edu.ifpb.explorae.user.dto.UserResponseDTO;
import br.edu.ifpb.explorae.user.dto.UserUpdateDTO;
import br.edu.ifpb.explorae.user.domain.User;
import org.springframework.web.multipart.MultipartFile;

public interface UserProfileService {
    UserResponseDTO getUserProfile(java.util.UUID id);
    String uploadAvatar(User user, MultipartFile file);
    UserResponseDTO updateUser(java.util.UUID userId, UserUpdateDTO dto);
}
