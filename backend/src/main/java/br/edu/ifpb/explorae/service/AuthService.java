package br.edu.ifpb.explorae.service;

import br.edu.ifpb.explorae.api.dto.AuthLoginResponseDTO;
import br.edu.ifpb.explorae.api.dto.LoginDTO;
import br.edu.ifpb.explorae.api.dto.UserResponseDTO;
import br.edu.ifpb.explorae.api.mapper.UserMapper;
import br.edu.ifpb.explorae.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final UserMapper userMapper;

    public AuthLoginResponseDTO login(LoginDTO loginDTO) {
        UsernamePasswordAuthenticationToken authToken = 
                new UsernamePasswordAuthenticationToken(loginDTO.email(), loginDTO.password());

        Authentication authentication = authenticationManager.authenticate(authToken);

        User user = (User) authentication.getPrincipal();
        String token = tokenService.generateToken(user);
        UserResponseDTO userResponse = userMapper.toResponseDTO(user);

        return new AuthLoginResponseDTO(token, userResponse);
    }
}
