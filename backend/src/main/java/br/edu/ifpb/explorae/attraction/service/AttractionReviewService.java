package br.edu.ifpb.explorae.attraction.service;

import br.edu.ifpb.explorae.attraction.domain.Attraction;
import br.edu.ifpb.explorae.attraction.domain.AttractionReview;
import br.edu.ifpb.explorae.attraction.dto.AttractionReviewDTO;
import br.edu.ifpb.explorae.attraction.dto.AttractionReviewRequestDTO;
import br.edu.ifpb.explorae.attraction.dto.ReviewResponseDTO;
import br.edu.ifpb.explorae.attraction.mapper.AttractionMapper;
import br.edu.ifpb.explorae.attraction.repository.AttractionRepository;
import br.edu.ifpb.explorae.attraction.repository.AttractionReviewRepository;
import br.edu.ifpb.explorae.common.exception.ResourceNotFoundException;
import br.edu.ifpb.explorae.gamification.dto.BadgeResponseDTO;
import br.edu.ifpb.explorae.gamification.event.ReviewCreatedEvent;
import br.edu.ifpb.explorae.gamification.mapper.BadgeMapper;
import br.edu.ifpb.explorae.gamification.service.BadgeUnlockTracker;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttractionReviewService {

    private final AttractionRepository attractionRepository;
    private final AttractionReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final AttractionMapper attractionMapper;
    private final ApplicationEventPublisher eventPublisher;
    private final BadgeMapper badgeMapper;
    private final BadgeUnlockTracker badgeUnlockTracker;

    @Transactional
    public ReviewResponseDTO addReview(UUID attractionId, AttractionReviewRequestDTO dto, UUID userId) {
        badgeUnlockTracker.clear();

        Attraction attraction = attractionRepository.findById(attractionId)
                .orElseThrow(() -> new ResourceNotFoundException("Atração não encontrada"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        AttractionReview review = AttractionReview.builder()
                .attraction(attraction)
                .user(user)
                .content(dto.content())
                .rating(dto.rating())
                .photoUrl(dto.photoUrl())
                .build();

        AttractionReview savedReview = reviewRepository.save(review);
        eventPublisher.publishEvent(new ReviewCreatedEvent(userId));

        // Recalcular e atualizar a média de avaliações (averageRating) da atração
        List<AttractionReview> reviews = reviewRepository.findByAttractionIdOrderByCreatedAtDesc(attractionId);
        double averageRating = reviews.stream()
                .mapToInt(AttractionReview::getRating)
                .average()
                .orElse(0.0);
        attraction.setAverageRating(averageRating);
        attractionRepository.save(attraction);

        AttractionReviewDTO reviewDto = attractionMapper.toReviewDTO(savedReview);
        List<BadgeResponseDTO> unlockedBadges = badgeMapper.toBadgeDTOList(badgeUnlockTracker.getAndClear());

        return new ReviewResponseDTO(reviewDto, unlockedBadges);
    }

    @Transactional(readOnly = true)
    public List<AttractionReviewDTO> getReviewsByAttractionId(UUID attractionId) {
        List<AttractionReview> reviews = reviewRepository.findByAttractionIdOrderByCreatedAtDesc(attractionId);
        return reviews.stream()
                .map(attractionMapper::toReviewDTO)
                .collect(Collectors.toList());
    }
}
