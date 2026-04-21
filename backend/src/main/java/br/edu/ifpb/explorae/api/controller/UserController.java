package br.edu.ifpb.explorae.api.controller;

import br.edu.ifpb.explorae.api.dto.StandardResponseDTO;
import br.edu.ifpb.explorae.api.dto.TravelPreferenceRequestDTO;
import br.edu.ifpb.explorae.api.dto.UserResponseDTO;
import br.edu.ifpb.explorae.api.dto.UserUpdateDTO;
import br.edu.ifpb.explorae.api.mapper.UserMapper;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.service.TravelPreferenceService;
import br.edu.ifpb.explorae.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final TravelPreferenceService travelPreferenceService;

    @GetMapping("/me")
    public ResponseEntity<StandardResponseDTO<UserResponseDTO>> getMe(@AuthenticationPrincipal User principal) {
        User user = userService.findById(principal.getId());
        UserResponseDTO responseDTO = userMapper.toResponseDTO(user);
        return ResponseEntity.ok(StandardResponseDTO.success("Perfil recuperado com sucesso", responseDTO));
    }

    @PutMapping("/me")
    public ResponseEntity<StandardResponseDTO<UserResponseDTO>> updateMe(
            @AuthenticationPrincipal User principal,
            @Valid @RequestBody UserUpdateDTO dto) {
        
        User updatedUser = userService.updateUser(principal.getId(), dto);
        UserResponseDTO responseDTO = userMapper.toResponseDTO(updatedUser);
        
        return ResponseEntity.ok(StandardResponseDTO.success("Perfil atualizado com sucesso", responseDTO));
    }

    @PutMapping("/me/preferences")
    public ResponseEntity<StandardResponseDTO<Void>> updateMyPreferences(
            @Valid @RequestBody TravelPreferenceRequestDTO dto,
            Authentication authentication) {

        User currentUser = (User) authentication.getPrincipal();

        travelPreferenceService.updatePreferences(currentUser.getId(), dto);

        return ResponseEntity.ok(
                StandardResponseDTO.success("Preferências atualizadas com sucesso", null)
        );
    }
}
