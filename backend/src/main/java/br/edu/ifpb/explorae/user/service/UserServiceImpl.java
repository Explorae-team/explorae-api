package br.edu.ifpb.explorae.user.service;

import br.edu.ifpb.explorae.user.dto.UserRegistrationDTO;
import br.edu.ifpb.explorae.user.dto.UserResponseDTO;
import br.edu.ifpb.explorae.user.mapper.UserMapper;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.user.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import br.edu.ifpb.explorae.common.exception.BusinessException;
import br.edu.ifpb.explorae.common.exception.ResourceNotFoundException;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserServiceImpl(
            UserRepository userRepository, 
            PasswordEncoder passwordEncoder, 
            UserMapper userMapper
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    // Busca o User e entrega pro Spring Security.
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("O e-mail não está cadastrado."));
    }

    @Override
    @Transactional
    public UserResponseDTO registerUser(UserRegistrationDTO dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new BusinessException("Esse e-mail já tá sendo usado, tente outro.");
        }

        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPasswordHash(passwordEncoder.encode(dto.password()));

        // XP e level iniciais são definidos lá no User.java.

        User savedUser = userRepository.save(user);
        return userMapper.toResponseDTO(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public User findById(java.util.UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuário não encontrado"));
    }

    @Override
    @Transactional
    public void deleteUser(java.util.UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("Usuário não encontrado");
        }
        userRepository.deleteById(userId);
    }

    @Override
    @Transactional
    public void resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com este e-mail"));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
