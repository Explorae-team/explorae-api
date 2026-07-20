package br.edu.ifpb.explorae.user.controller;

import br.edu.ifpb.explorae.common.dto.StandardResponseDTO;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.user.dto.UserResponseDTO;
import br.edu.ifpb.explorae.user.dto.UserUpdateDTO;
import br.edu.ifpb.explorae.user.service.UserProfileService;
import br.edu.ifpb.explorae.user.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @Mock
    private UserProfileService userProfileService;

    @InjectMocks
    private UserController userController;

    private User principalUser;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        principalUser = new User();
        principalUser.setId(UUID.randomUUID());
        principalUser.setEmail("test@test.com");

        mockMvc = MockMvcBuilders.standaloneSetup(userController)
                .setCustomArgumentResolvers(new org.springframework.web.method.support.HandlerMethodArgumentResolver() {
                    @Override
                    public boolean supportsParameter(org.springframework.core.MethodParameter parameter) {
                        return parameter.getParameterType().isAssignableFrom(User.class) &&
                               parameter.hasParameterAnnotation(org.springframework.security.core.annotation.AuthenticationPrincipal.class);
                    }

                    @Override
                    public Object resolveArgument(org.springframework.core.MethodParameter parameter, org.springframework.web.method.support.ModelAndViewContainer mavContainer, org.springframework.web.context.request.NativeWebRequest webRequest, org.springframework.web.bind.support.WebDataBinderFactory binderFactory) {
                        return principalUser;
                    }
                })
                .build();
        objectMapper = new ObjectMapper();

        principalUser = new User();
        principalUser.setId(UUID.randomUUID());
        principalUser.setEmail("test@test.com");
    }

    @Test
    void getMe_shouldReturnUserProfile() throws Exception {
        UserResponseDTO responseDTO = new UserResponseDTO(principalUser.getId(), "Test User", "test@test.com", null, null, null, 0, 1, 0, "Iniciante", false, null);

        when(userProfileService.getUserProfile(principalUser.getId())).thenReturn(responseDTO);

        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Perfil recuperado com sucesso"))
                .andExpect(jsonPath("$.data.name").value("Test User"));
    }

    @Test
    void uploadAvatar_shouldUploadAndReturnUrl() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "image".getBytes());
        String photoUrl = "http://url/to/photo.jpg";

        when(userProfileService.uploadAvatar(any(), eq(file))).thenReturn(photoUrl);

        mockMvc.perform(multipart("/api/v1/users/me/avatar")
                .file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Avatar enviado com sucesso"))
                .andExpect(jsonPath("$.data").value(photoUrl));
    }

    @Test
    void updateMe_shouldUpdateAndReturnProfile() throws Exception {
        UserUpdateDTO updateDTO = new UserUpdateDTO("Updated Name", null, null, null);

        UserResponseDTO responseDTO = new UserResponseDTO(principalUser.getId(), "Updated Name", "test@test.com", null, null, null, 0, 1, 0, "Iniciante", false, null);

        when(userProfileService.updateUser(any(), any(UserUpdateDTO.class))).thenReturn(responseDTO);

        mockMvc.perform(put("/api/v1/users/me")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Perfil atualizado com sucesso"))
                .andExpect(jsonPath("$.data.name").value("Updated Name"));
    }

    @Test
    void deleteMe_shouldDeleteUser() throws Exception {
        doNothing().when(userService).deleteUser(any());

        mockMvc.perform(delete("/api/v1/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Conta deletada com sucesso"));

        verify(userService, times(1)).deleteUser(any());
    }
}
