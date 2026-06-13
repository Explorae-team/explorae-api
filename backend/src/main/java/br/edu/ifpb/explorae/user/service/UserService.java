package br.edu.ifpb.explorae.user.service;

import br.edu.ifpb.explorae.user.dto.UserRegistrationDTO;
import br.edu.ifpb.explorae.user.dto.UserResponseDTO;
import br.edu.ifpb.explorae.user.domain.User;

public interface UserService {
    UserResponseDTO registerUser(UserRegistrationDTO dto);
    User findById(java.util.UUID id);
    void deleteUser(java.util.UUID userId);
    void resetPassword(String email, String newPassword);
}
