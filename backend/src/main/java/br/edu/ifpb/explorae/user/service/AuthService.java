package br.edu.ifpb.explorae.user.service;

import br.edu.ifpb.explorae.user.dto.AuthLoginResponseDTO;
import br.edu.ifpb.explorae.user.dto.LoginDTO;

public interface AuthService {
    AuthLoginResponseDTO login(LoginDTO loginDTO);
}
