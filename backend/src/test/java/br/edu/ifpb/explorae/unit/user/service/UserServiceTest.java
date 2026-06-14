package br.edu.ifpb.explorae.unit.user.service;

import br.edu.ifpb.explorae.common.exception.BusinessException;
import br.edu.ifpb.explorae.common.exception.ResourceNotFoundException;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.user.dto.UserRegistrationDTO;
import br.edu.ifpb.explorae.user.dto.UserResponseDTO;
import br.edu.ifpb.explorae.user.mapper.UserMapper;
import br.edu.ifpb.explorae.user.repository.UserRepository;
import br.edu.ifpb.explorae.user.service.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        user = new User();
        user.setId(userId);
        user.setEmail("test@test.com");
        user.setPasswordHash("hashed_password");
        user.setName("Test User");
    }

    @Test
    void loadUserByUsername_success() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));

        UserDetails result = userService.loadUserByUsername("test@test.com");

        assertNotNull(result);
        assertEquals("test@test.com", result.getUsername());
    }

    @Test
    void loadUserByUsername_notFound_throwsException() {
        when(userRepository.findByEmail("notfound@test.com")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> userService.loadUserByUsername("notfound@test.com"));
    }

    @Test
    void registerUser_success() {
        UserRegistrationDTO dto = new UserRegistrationDTO("Test User", "test@test.com", "password");
        UserResponseDTO responseDTO = new UserResponseDTO(userId, "Test User", "test@test.com", null, null, null, 0, 1, 0, "Iniciante", false, null);

        when(userRepository.existsByEmail("test@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userMapper.toResponseDTO(any(User.class))).thenReturn(responseDTO);

        UserResponseDTO result = userService.registerUser(dto);

        assertNotNull(result);
        assertEquals(userId, result.id());
        assertEquals("test@test.com", result.email());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerUser_emailExists_throwsException() {
        UserRegistrationDTO dto = new UserRegistrationDTO("Test", "test@test.com", "password");

        when(userRepository.existsByEmail("test@test.com")).thenReturn(true);

        assertThrows(BusinessException.class, () -> userService.registerUser(dto));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void findById_success() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        User result = userService.findById(userId);

        assertNotNull(result);
        assertEquals(userId, result.getId());
    }

    @Test
    void findById_notFound_throwsException() {
        UUID randomId = UUID.randomUUID();
        when(userRepository.findById(randomId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.findById(randomId));
    }

    @Test
    void deleteUser_success() {
        when(userRepository.existsById(userId)).thenReturn(true);

        userService.deleteUser(userId);

        verify(userRepository).deleteById(userId);
    }

    @Test
    void deleteUser_notFound_throwsException() {
        when(userRepository.existsById(userId)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> userService.deleteUser(userId));
        verify(userRepository, never()).deleteById(any());
    }

    @Test
    void resetPassword_success() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("newPassword")).thenReturn("newHashed");

        userService.resetPassword("test@test.com", "newPassword");

        verify(userRepository).save(user);
        assertEquals("newHashed", user.getPasswordHash());
    }

    @Test
    void resetPassword_notFound_throwsException() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.resetPassword("test@test.com", "newPassword"));
        verify(userRepository, never()).save(any());
    }
}
