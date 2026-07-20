package br.edu.ifpb.explorae.user.service;

import br.edu.ifpb.explorae.user.dto.TravelPreferenceRequestDTO;
import br.edu.ifpb.explorae.user.domain.TravelPreference;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.gamification.event.PreferenceCompletedEvent;
import br.edu.ifpb.explorae.user.repository.CategoryRepository;
import br.edu.ifpb.explorae.user.repository.TravelPreferenceRepository;
import br.edu.ifpb.explorae.user.repository.UserRepository;
import br.edu.ifpb.explorae.gamification.dto.BadgeResponseDTO;
import br.edu.ifpb.explorae.gamification.mapper.BadgeMapper;
import br.edu.ifpb.explorae.gamification.service.BadgeUnlockTracker;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import br.edu.ifpb.explorae.user.domain.Category;
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
    private final BadgeUnlockTracker badgeUnlockTracker;
    private final BadgeMapper badgeMapper;

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
    public List<BadgeResponseDTO> updatePreferences(UUID userId, TravelPreferenceRequestDTO dto) {
        badgeUnlockTracker.clear();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        boolean isFirstTime = travelPreferenceRepository.findByUser(user)
                .map(p -> p.getInterests() == null || p.getInterests().isEmpty())
                .orElse(true);

        TravelPreference preference = travelPreferenceRepository.findByUser(user)
                .orElse(new TravelPreference());

        if (preference.getUser() == null) {
            preference.setUser(user);
        }
        user.setTravelPreference(preference);

        if (dto.interests() != null) {
            java.util.List<Category> categories = categoryRepository
                    .findAllBySlugIn(dto.interests());

            preference.getInterests().clear();
            preference.getInterests().addAll(categories);
        }

        travelPreferenceRepository.save(preference);

        if (dto.interests() != null && !dto.interests().isEmpty()) {
            eventPublisher.publishEvent(new PreferenceCompletedEvent(userId));
        }

        return badgeMapper.toBadgeDTOList(badgeUnlockTracker.getAndClear());
    }
}
