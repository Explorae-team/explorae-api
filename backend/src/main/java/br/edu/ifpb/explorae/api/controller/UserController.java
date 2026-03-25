package br.edu.ifpb.explorae.api.controller;

import br.edu.ifpb.explorae.api.dto.StandardResponseDTO;
import br.edu.ifpb.explorae.api.dto.UserRegistrationDTO;
import br.edu.ifpb.explorae.api.dto.UserResponseDTO;
import br.edu.ifpb.explorae.api.mapper.UserMapper;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @PostMapping
    public ResponseEntity<StandardResponseDTO<UserResponseDTO>> register(@Valid @RequestBody UserRegistrationDTO dto) {
        User registeredUser = userService.registerUser(dto);
        UserResponseDTO responseDTO = userMapper.toResponseDTO(registeredUser);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(StandardResponseDTO.success("Usuário cadastrado com sucesso", responseDTO));
    }
}
