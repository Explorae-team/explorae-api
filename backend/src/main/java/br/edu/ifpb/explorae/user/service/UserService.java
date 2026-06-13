package br.edu.ifpb.explorae.user.service;

import br.edu.ifpb.explorae.user.dto.UserRegistrationDTO;
import br.edu.ifpb.explorae.user.dto.UserResponseDTO;
import br.edu.ifpb.explorae.user.dto.UserUpdateDTO;
import br.edu.ifpb.explorae.user.domain.User;

public interface UserService {
    UserResponseDTO registerUser(UserRegistrationDTO dto);
    User findById(java.util.UUID id);
    UserResponseDTO getUserProfile(java.util.UUID id);
    void updateAvatar(java.util.UUID userId, String photoUrl);
    UserResponseDTO updateUser(java.util.UUID userId, UserUpdateDTO dto);
    void deleteUser(java.util.UUID userId);
    void resetPassword(String email, String newPassword);
}
