package br.edu.ifpb.explorae.service;

import br.edu.ifpb.explorae.api.dto.UserRegistrationDTO;
import br.edu.ifpb.explorae.api.dto.UserUpdateDTO;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import br.edu.ifpb.explorae.api.exception.BusinessException;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    // Busca o User e entrega pro Spring Security.
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("O e-mail não está cadastrado."));
    }

    //Registra o User
    @Transactional
    public User registerUser(UserRegistrationDTO dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new BusinessException("Esse e-mail já tá sendo usado, tente outro.");
        }

        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPasswordHash(passwordEncoder.encode(dto.password()));
        
        // Os valores iniciais de XP e level são definidos lá no User.java pelo @PrePersist.

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User findById(java.util.UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new br.edu.ifpb.explorae.api.exception.ResourceNotFoundException("Usuário não encontrado"));
    }

    @Transactional
    public void updateAvatar(java.util.UUID userId, String photoUrl) {
        User user = findById(userId);
        user.setPhotoUrl(photoUrl);
        userRepository.save(user);
    }

    @Transactional
    public User updateUser(java.util.UUID userId, UserUpdateDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new br.edu.ifpb.explorae.api.exception.ResourceNotFoundException("Usuário não encontrado"));
        
        user.setName(dto.name());
        user.setPhone(dto.phone());
        user.setBio(dto.bio());
        user.setPhotoUrl(dto.photoUrl());
        return userRepository.save(user);
    }
}
