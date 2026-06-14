package br.edu.ifpb.explorae.attraction.service;

import br.edu.ifpb.explorae.attraction.domain.Attraction;
import br.edu.ifpb.explorae.attraction.domain.SavedAttraction;
import br.edu.ifpb.explorae.attraction.domain.UserInteraction;
import br.edu.ifpb.explorae.attraction.dto.AttractionResponseDTO;
import br.edu.ifpb.explorae.attraction.dto.CheckInResponseDTO;
import br.edu.ifpb.explorae.attraction.dto.FavoriteResponseDTO;
import br.edu.ifpb.explorae.attraction.repository.AttractionRepository;
import br.edu.ifpb.explorae.attraction.repository.SavedAttractionRepository;
import br.edu.ifpb.explorae.attraction.repository.UserInteractionRepository;
import br.edu.ifpb.explorae.common.exception.ResourceNotFoundException;
import br.edu.ifpb.explorae.gamification.dto.BadgeResponseDTO;
import br.edu.ifpb.explorae.gamification.event.DestinationReachedEvent;
import br.edu.ifpb.explorae.gamification.event.FavoriteCreatedEvent;
import br.edu.ifpb.explorae.gamification.mapper.BadgeMapper;
import br.edu.ifpb.explorae.gamification.service.BadgeUnlockTracker;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttractionInteractionService {

    private final AttractionRepository attractionRepository;
    private final UserRepository userRepository;
    private final SavedAttractionRepository savedAttractionRepository;
    private final UserInteractionRepository userInteractionRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final BadgeMapper badgeMapper;
    private final BadgeUnlockTracker badgeUnlockTracker;

    @Transactional
    public void registerView(User principal, Attraction attraction) {
        if (principal == null) return;
        
        UserInteraction interaction = UserInteraction.builder()
                .user(principal)
                .attraction(attraction)
                .interactionType("VIEW")
                .build();
        userInteractionRepository.save(interaction);
    }

    public boolean isSaved(User principal, UUID attractionId) {
        if (principal == null) return false;
        return savedAttractionRepository.existsByUserIdAndAttractionId(principal.getId(), attractionId);
    }

    @Transactional
    public CheckInResponseDTO checkIn(UUID attractionId, UUID userId) {
        badgeUnlockTracker.clear();

        Attraction attraction = attractionRepository.findById(attractionId)
                .orElseThrow(() -> new ResourceNotFoundException("Atração não encontrada"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        UserInteraction interaction = UserInteraction.builder()
                .user(user)
                .attraction(attraction)
                .interactionType("CHECK_IN")
                .build();
        userInteractionRepository.save(interaction);

        eventPublisher.publishEvent(new DestinationReachedEvent(userId));

        List<BadgeResponseDTO> unlockedBadges = badgeMapper.toBadgeDTOList(badgeUnlockTracker.getAndClear());

        return new CheckInResponseDTO("success", unlockedBadges);
    }

    @Transactional
    public FavoriteResponseDTO toggleFavorite(UUID attractionId, UUID userId) {
        badgeUnlockTracker.clear();

        Attraction attraction = attractionRepository.findById(attractionId)
                .orElseThrow(() -> new ResourceNotFoundException("Atração não encontrada"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        Optional<SavedAttraction> savedOpt = savedAttractionRepository.findByUserIdAndAttractionId(userId,
                attractionId);

        boolean isFavorite;
        if (savedOpt.isPresent()) {
            savedAttractionRepository.delete(savedOpt.get());
            isFavorite = false;
        } else {
            SavedAttraction saved = SavedAttraction.builder()
                    .user(user)
                    .attraction(attraction)
                    .build();
            savedAttractionRepository.save(saved);

            eventPublisher.publishEvent(new FavoriteCreatedEvent(userId));
            isFavorite = true;
        }

        List<BadgeResponseDTO> unlockedBadges = badgeMapper.toBadgeDTOList(badgeUnlockTracker.getAndClear());
        return new FavoriteResponseDTO(isFavorite, unlockedBadges);
    }

    @Transactional(readOnly = true)
    public List<AttractionResponseDTO> getSavedAttractions(UUID userId) {
        List<SavedAttraction> savedList = savedAttractionRepository.findAllByUserId(userId);
        return savedList.stream()
                .map(SavedAttraction::getAttraction)
                .map(attraction -> AttractionResponseDTO.fromEntity(attraction, "Salvo"))
                .collect(Collectors.toList());
    }
}
