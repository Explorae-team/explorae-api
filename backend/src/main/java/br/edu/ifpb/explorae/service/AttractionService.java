package br.edu.ifpb.explorae.service;

import br.edu.ifpb.explorae.api.dto.AttractionDetailsResponseDTO;
import br.edu.ifpb.explorae.api.dto.AttractionResponseDTO;
import br.edu.ifpb.explorae.api.dto.AttractionReviewDTO;
import br.edu.ifpb.explorae.api.dto.AttractionReviewRequestDTO;
import br.edu.ifpb.explorae.api.mapper.AttractionMapper;
import br.edu.ifpb.explorae.domain.attraction.Attraction;
import br.edu.ifpb.explorae.domain.attraction.AttractionReview;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.repository.UserRepository;
import br.edu.ifpb.explorae.api.exception.ResourceNotFoundException;
import br.edu.ifpb.explorae.repository.AttractionRepository;
import br.edu.ifpb.explorae.repository.AttractionReviewRepository;
import br.edu.ifpb.explorae.repository.SavedAttractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttractionService {

    private final AttractionRepository attractionRepository;
    private final AttractionReviewRepository reviewRepository;
    private final SavedAttractionRepository savedAttractionRepository;
    private final UserRepository userRepository;
    private final AttractionMapper attractionMapper;

    @Transactional(readOnly = true)
    public Page<AttractionResponseDTO> findAll(String category, Pageable pageable) {
        Page<Attraction> page;
        if (category != null && !category.isEmpty()) {
            page = attractionRepository.findByCategory(category, pageable);
        } else {
            page = attractionRepository.findAll(pageable);
        }

        return page.map(attraction -> AttractionResponseDTO.fromEntity(attraction, "2.4 km"));
    }

    @Transactional(readOnly = true)
    public AttractionDetailsResponseDTO getAttractionDetails(UUID attractionId, User principal) {
        Attraction attraction = attractionRepository.findById(attractionId)
                .orElseThrow(() -> new ResourceNotFoundException("Atração não encontrada"));

        boolean isSaved = false;
        if (principal != null) {
            isSaved = savedAttractionRepository.existsByUserIdAndAttractionId(principal.getId(), attractionId);
        }

        List<AttractionReview> reviews = reviewRepository.findByAttractionIdOrderByCreatedAtDesc(attractionId);
        
        List<AttractionReviewDTO> reviewDTOs = reviews.stream()
                .map(attractionMapper::toReviewDTO)
                .collect(Collectors.toList());

        return attractionMapper.toDetailsDTO(attraction, isSaved, reviewDTOs);
    }

    @Transactional
    public AttractionReviewDTO addReview(UUID attractionId, AttractionReviewRequestDTO dto, UUID userId) {
        Attraction attraction = attractionRepository.findById(attractionId)
                .orElseThrow(() -> new ResourceNotFoundException("Atração não encontrada"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        AttractionReview review = AttractionReview.builder()
                .attraction(attraction)
                .user(user)
                .content(dto.content())
                .rating(dto.rating())
                .build();

        AttractionReview savedReview = reviewRepository.save(review);
        return attractionMapper.toReviewDTO(savedReview);
    }
}
