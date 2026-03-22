package br.edu.ifpb.explorae.service;

import br.edu.ifpb.explorae.api.dto.UserRegistrationDTO;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User registerUser(UserRegistrationDTO dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new RuntimeException("Este e-mail já está cadastrado.");
        }

        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPasswordHash(passwordEncoder.encode(dto.password()));
        
        // Os valores padrão (xp, level, coins) já são tratados no @PrePersist da entidade User

        return userRepository.save(user);
    }
}
