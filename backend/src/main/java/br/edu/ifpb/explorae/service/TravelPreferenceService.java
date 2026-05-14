package br.edu.ifpb.explorae.service;

import br.edu.ifpb.explorae.api.dto.TravelPreferenceRequestDTO;
import br.edu.ifpb.explorae.domain.user.TravelPreference;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.event.PreferenceCompletedEvent;
import br.edu.ifpb.explorae.repository.CategoryRepository;
import br.edu.ifpb.explorae.repository.TravelPreferenceRepository;
import br.edu.ifpb.explorae.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import br.edu.ifpb.explorae.domain.user.Category;
import java.util.stream.Collectors;

import java.util.List;
import java.util.UUID;
import java.util.Arrays;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class TravelPreferenceService {

    private final TravelPreferenceRepository travelPreferenceRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional(readOnly = true)
    public List<String> getPreferences(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return travelPreferenceRepository.findByUser(user)
                .map(p -> p.getInterests().stream()
                        .map(Category::getSlug)
                        .collect(Collectors.toList()))
                .orElse(new ArrayList<String>());
    }

    @Transactional
    public void updatePreferences(UUID userId, TravelPreferenceRequestDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        boolean isFirstTime = travelPreferenceRepository.findByUser(user).isEmpty();

        TravelPreference preference = travelPreferenceRepository.findByUser(user)
                .orElse(new TravelPreference());

        if (preference.getUser() == null) {
            preference.setUser(user);
        }

        if (dto.interests() != null) {
            java.util.List<br.edu.ifpb.explorae.domain.user.Category> categories = categoryRepository
                    .findAllBySlugIn(dto.interests());

            preference.getInterests().clear();
            preference.getInterests().addAll(categories);
        }

        travelPreferenceRepository.save(preference);

        if (isFirstTime) {
            eventPublisher.publishEvent(new PreferenceCompletedEvent(userId));
        }
    }
}
