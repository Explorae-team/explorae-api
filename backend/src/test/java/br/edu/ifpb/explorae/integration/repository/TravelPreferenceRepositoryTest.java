package br.edu.ifpb.explorae.integration.repository;

import br.edu.ifpb.explorae.domain.user.TravelPreference;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.repository.TravelPreferenceRepository;
import br.edu.ifpb.explorae.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("Testes para TravelPreferenceRepository")
class TravelPreferenceRepositoryTest {

    @Autowired
    private TravelPreferenceRepository travelPreferenceRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Deve salvar e buscar preferências por usuário")
    void shouldSaveAndFindByUser() {
        // Given
        User user = User.builder()
                .name("Test User")
                .email("test@explorae.com")
                .passwordHash("hashed_password")
                .build();
        user = userRepository.save(user);

        TravelPreference preference = TravelPreference.builder()
                .user(user)
                .interests("Natureza, Museus")
                .build();
        
        // When
        travelPreferenceRepository.save(preference);
        Optional<TravelPreference> found = travelPreferenceRepository.findByUser(user);

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getInterests()).isEqualTo("Natureza, Museus");
        assertThat(found.get().getUser().getId()).isEqualTo(user.getId());
    }

    @Test
    @DisplayName("Deve deletar preferências em cascata ao deletar usuário")
    void shouldDeleteCascadeOnUserDelete() {
        // Given
        User user = User.builder()
                .name("Cascade User")
                .email("cascade@explorae.com")
                .passwordHash("password")
                .build();
        user = userRepository.save(user);

        TravelPreference preference = TravelPreference.builder()
                .user(user)
                .interests("Culinária")
                .build();
        
        // Em OneToOne bidirecional, configuramos ambos os lados
        user.setTravelPreference(preference);
        travelPreferenceRepository.save(preference);

        UUID preferenceId = preference.getId();

        // When
        userRepository.delete(user);
        
        // Then
        Optional<TravelPreference> found = travelPreferenceRepository.findById(preferenceId);
        assertThat(found).isEmpty();
    }
}
