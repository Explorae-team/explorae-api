package br.edu.ifpb.explorae.user.service;

import br.edu.ifpb.explorae.user.dto.AuthLoginResponseDTO;
import br.edu.ifpb.explorae.user.dto.LoginDTO;
import br.edu.ifpb.explorae.user.dto.UserResponseDTO;
import br.edu.ifpb.explorae.user.mapper.UserMapper;
import br.edu.ifpb.explorae.common.security.UserDetailsImpl;
import br.edu.ifpb.explorae.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final UserMapper userMapper;

    @Override
    public AuthLoginResponseDTO login(LoginDTO loginDTO) {
        UsernamePasswordAuthenticationToken authToken = 
                new UsernamePasswordAuthenticationToken(loginDTO.email(), loginDTO.password());

        Authentication authentication = authenticationManager.authenticate(authToken);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userDetails.getUser();
        String token = tokenService.generateToken(user);
        UserResponseDTO userResponse = userMapper.toResponseDTO(user);

        return new AuthLoginResponseDTO(token, userResponse);
    }
}
