package br.edu.ifpb.explorae.user.service;

import br.edu.ifpb.explorae.user.dto.UserResponseDTO;
import br.edu.ifpb.explorae.user.dto.UserUpdateDTO;
import br.edu.ifpb.explorae.user.mapper.UserMapper;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.user.repository.UserRepository;
import br.edu.ifpb.explorae.attraction.repository.UserInteractionRepository;
import br.edu.ifpb.explorae.gamification.repository.ChallengeRepository;
import br.edu.ifpb.explorae.common.storage.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import br.edu.ifpb.explorae.common.exception.ResourceNotFoundException;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserProfileServiceImpl implements UserProfileService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final UserInteractionRepository userInteractionRepository;
    private final ChallengeRepository challengeRepository;
    private final FileStorageService fileStorageService;

    public UserProfileServiceImpl(
            UserRepository userRepository,
            UserMapper userMapper,
            UserInteractionRepository userInteractionRepository,
            ChallengeRepository challengeRepository,
            FileStorageService fileStorageService
    ) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.userInteractionRepository = userInteractionRepository;
        this.challengeRepository = challengeRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
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

    @Override
    @Transactional
    public String uploadAvatar(User principal, MultipartFile file) {
        String photoUrl = fileStorageService.saveFile(file, "avatars");

        // Remove a foto antiga se existir e for local
        if (principal.getPhotoUrl() != null) {
            fileStorageService.deleteFile(principal.getPhotoUrl());
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        user.setPhotoUrl(photoUrl);
        userRepository.save(user);
        
        return photoUrl;
    }

    @Override
    @Transactional
    public UserResponseDTO updateUser(java.util.UUID userId, UserUpdateDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        if (dto.name() != null) user.setName(dto.name());
        if (dto.phone() != null) user.setPhone(dto.phone());
        if (dto.bio() != null) user.setBio(dto.bio());
        if (dto.photoUrl() != null) user.setPhotoUrl(dto.photoUrl());
        
        User updatedUser = userRepository.save(user);
        return userMapper.toResponseDTO(updatedUser);
    }
}

