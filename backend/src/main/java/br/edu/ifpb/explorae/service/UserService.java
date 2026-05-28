package br.edu.ifpb.explorae.service;

import br.edu.ifpb.explorae.api.dto.UserRegistrationDTO;
import br.edu.ifpb.explorae.api.dto.UserResponseDTO;
import br.edu.ifpb.explorae.api.dto.UserUpdateDTO;
import br.edu.ifpb.explorae.api.mapper.UserMapper;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.repository.UserRepository;
import br.edu.ifpb.explorae.repository.UserInteractionRepository;
import br.edu.ifpb.explorae.repository.ChallengeRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import br.edu.ifpb.explorae.api.exception.BusinessException;
import br.edu.ifpb.explorae.api.exception.ResourceNotFoundException;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final UserInteractionRepository userInteractionRepository;
    private final ChallengeRepository challengeRepository;

    public UserService(
            UserRepository userRepository, 
            PasswordEncoder passwordEncoder, 
            UserMapper userMapper,
            UserInteractionRepository userInteractionRepository,
            ChallengeRepository challengeRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        this.userInteractionRepository = userInteractionRepository;
        this.challengeRepository = challengeRepository;
    }

    // Busca o User e entrega pro Spring Security.
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("O e-mail não está cadastrado."));
    }

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

    @Transactional(readOnly = true)
    public User findById(java.util.UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuário não encontrado"));
    }

    @Transactional(readOnly = true)
    public UserResponseDTO getUserProfile(java.util.UUID id) {
        User user = userRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        
        UserResponseDTO baseDTO = userMapper.toResponseDTO(user);
        
        long checkInCount = userInteractionRepository.countDistinctAttractionsByUserIdAndInteractionType(id, "CHECK_IN");
        long activeChallengesCount = challengeRepository.findActiveChallenges(java.time.LocalDateTime.now()).size();
        
        return new UserResponseDTO(
                baseDTO.id(),
                baseDTO.name(),
                baseDTO.email(),
                baseDTO.phone(),
                baseDTO.bio(),
                baseDTO.photoUrl(),
                baseDTO.xp(),
                baseDTO.level(),
                baseDTO.coins(),
                baseDTO.levelName(),
                baseDTO.hasPreferences(),
                baseDTO.badges(),
                (int) checkInCount,
                (int) activeChallengesCount
        );
    }

    @Transactional
    public void updateAvatar(java.util.UUID userId, String photoUrl) {
        User user = findById(userId);
        user.setPhotoUrl(photoUrl);
        userRepository.save(user);
    }

    @Transactional
    public UserResponseDTO updateUser(java.util.UUID userId, UserUpdateDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuário não encontrado"));

        if (dto.name() != null) user.setName(dto.name());
        if (dto.phone() != null) user.setPhone(dto.phone());
        if (dto.bio() != null) user.setBio(dto.bio());
        if (dto.photoUrl() != null) user.setPhotoUrl(dto.photoUrl());
        
        User updatedUser = userRepository.save(user);
        return userMapper.toResponseDTO(updatedUser);
    }

    @Transactional
    public void deleteUser(java.util.UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("Usuário não encontrado");
        }
        userRepository.deleteById(userId);
    }

    @Transactional
    public void resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com este e-mail"));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
