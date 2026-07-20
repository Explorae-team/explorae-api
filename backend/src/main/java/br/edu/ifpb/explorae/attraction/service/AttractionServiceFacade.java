package br.edu.ifpb.explorae.attraction.service;

import br.edu.ifpb.explorae.attraction.domain.Attraction;
import br.edu.ifpb.explorae.attraction.dto.AttractionDetailsResponseDTO;
import br.edu.ifpb.explorae.attraction.dto.AttractionResponseDTO;
import br.edu.ifpb.explorae.attraction.dto.AttractionReviewDTO;
import br.edu.ifpb.explorae.attraction.dto.AttractionReviewRequestDTO;
import br.edu.ifpb.explorae.attraction.dto.CheckInResponseDTO;
import br.edu.ifpb.explorae.attraction.dto.FavoriteResponseDTO;
import br.edu.ifpb.explorae.attraction.dto.ReviewResponseDTO;
import br.edu.ifpb.explorae.attraction.mapper.AttractionMapper;
import br.edu.ifpb.explorae.attraction.repository.AttractionRepository;
import br.edu.ifpb.explorae.common.exception.ResourceNotFoundException;
import br.edu.ifpb.explorae.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttractionServiceFacade {

    private final AttractionRepository attractionRepository;
    private final AttractionMapper attractionMapper;

    private final AttractionSearchService searchService;
    private final AttractionRecommendationService recommendationService;
    private final AttractionReviewService reviewService;
    private final AttractionInteractionService interactionService;

    @Transactional(readOnly = true)
    public Page<AttractionResponseDTO> findAll(
            String category, Double minRating, Double minPrice, Double maxPrice,
            Boolean openNow, Double latitude, Double longitude, Double maxDistance,
            Pageable pageable) {
        return searchService.findAll(category, minRating, minPrice, maxPrice, openNow, latitude, longitude, maxDistance, pageable);
    }

    @Transactional
    public AttractionDetailsResponseDTO getAttractionDetails(UUID attractionId, User principal) {
        Attraction attraction = attractionRepository.findById(attractionId)
                .orElseThrow(() -> new ResourceNotFoundException("Atração não encontrada"));

        boolean isSaved = interactionService.isSaved(principal, attractionId);
        
        interactionService.registerView(principal, attraction);

        List<AttractionReviewDTO> reviewDTOs = reviewService.getReviewsByAttractionId(attractionId);

        return attractionMapper.toDetailsDTO(attraction, isSaved, reviewDTOs);
    }

    @Transactional
    public ReviewResponseDTO addReview(UUID attractionId, AttractionReviewRequestDTO dto, UUID userId) {
        return reviewService.addReview(attractionId, dto, userId);
    }

    @Transactional
    public CheckInResponseDTO checkIn(UUID attractionId, UUID userId) {
        return interactionService.checkIn(attractionId, userId);
    }

    @Transactional(readOnly = true)
    public Page<AttractionResponseDTO> getRecommendations(User user, Double latitude, Double longitude, Pageable pageable) {
        return recommendationService.getRecommendations(user, latitude, longitude, pageable);
    }

    @Transactional
    public FavoriteResponseDTO toggleFavorite(UUID attractionId, UUID userId) {
        return interactionService.toggleFavorite(attractionId, userId);
    }

    @Transactional(readOnly = true)
    public List<AttractionResponseDTO> getSavedAttractions(UUID userId) {
        return interactionService.getSavedAttractions(userId);
    }
}
