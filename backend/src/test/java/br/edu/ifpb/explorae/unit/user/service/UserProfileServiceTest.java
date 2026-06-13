package br.edu.ifpb.explorae.unit.user.service;

import br.edu.ifpb.explorae.attraction.repository.UserInteractionRepository;
import br.edu.ifpb.explorae.common.exception.ResourceNotFoundException;
import br.edu.ifpb.explorae.common.storage.FileStorageService;
import br.edu.ifpb.explorae.gamification.repository.ChallengeRepository;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.user.dto.UserResponseDTO;
import br.edu.ifpb.explorae.user.dto.UserUpdateDTO;
import br.edu.ifpb.explorae.user.mapper.UserMapper;
import br.edu.ifpb.explorae.user.repository.UserRepository;
import br.edu.ifpb.explorae.user.service.UserProfileServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserProfileServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private UserInteractionRepository userInteractionRepository;

    @Mock
    private ChallengeRepository challengeRepository;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private UserProfileServiceImpl userProfileService;

    private User user;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        user = new User();
        user.setId(userId);
        user.setName("Test User");
        user.setPhotoUrl("oldPhotoUrl");
    }

    @Test
    void getUserProfile_success() {
        UserResponseDTO baseDTO = new UserResponseDTO(
                userId, "Test User", "test@test.com", null, null, null, 0, 1, 0, "Iniciante", false, Collections.emptyList(), 0, 0
        );

        when(userRepository.findByIdWithDetails(userId)).thenReturn(Optional.of(user));
        when(userMapper.toResponseDTO(user)).thenReturn(baseDTO);
        when(userInteractionRepository.countDistinctAttractionsByUserIdAndInteractionType(userId, "CHECK_IN")).thenReturn(5L);
        when(challengeRepository.findActiveChallenges(any())).thenReturn(Collections.nCopies(3, null)); // Mocking 3 challenges

        UserResponseDTO result = userProfileService.getUserProfile(userId);

        assertNotNull(result);
        assertEquals(userId, result.id());
        assertEquals(5, result.checkInCount());
        assertEquals(3, result.activeChallengesCount());
    }

    @Test
    void getUserProfile_notFound_throwsException() {
        when(userRepository.findByIdWithDetails(userId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userProfileService.getUserProfile(userId));
    }

    @Test
    void uploadAvatar_success() {
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "image".getBytes());
        String newPhotoUrl = "newPhotoUrl";

        when(fileStorageService.saveFile(file, "avatars")).thenReturn(newPhotoUrl);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        String result = userProfileService.uploadAvatar(user, file);

        assertEquals(newPhotoUrl, result);
        assertEquals(newPhotoUrl, user.getPhotoUrl());
        verify(fileStorageService).deleteFile("oldPhotoUrl");
        verify(userRepository).save(user);
    }

    @Test
    void uploadAvatar_notFound_throwsException() {
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "image".getBytes());
        String newPhotoUrl = "newPhotoUrl";

        when(fileStorageService.saveFile(file, "avatars")).thenReturn(newPhotoUrl);
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userProfileService.uploadAvatar(user, file));
    }

    @Test
    void updateUser_success() {
        UserUpdateDTO updateDTO = new UserUpdateDTO("New Name", null, "New Bio", null);

        UserResponseDTO responseDTO = new UserResponseDTO(
                userId, "New Name", "test@test.com", null, "New Bio", null, 0, 1, 0, "Iniciante", false, Collections.emptyList(), 0, 0
        );

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toResponseDTO(user)).thenReturn(responseDTO);

        UserResponseDTO result = userProfileService.updateUser(userId, updateDTO);

        assertNotNull(result);
        assertEquals("New Name", result.name());
        assertEquals("New Name", user.getName());
        assertEquals("New Bio", user.getBio());
        verify(userRepository).save(user);
    }

    @Test
    void updateUser_notFound_throwsException() {
        UserUpdateDTO updateDTO = new UserUpdateDTO("New Name", null, null, null);

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userProfileService.updateUser(userId, updateDTO));
    }
}
