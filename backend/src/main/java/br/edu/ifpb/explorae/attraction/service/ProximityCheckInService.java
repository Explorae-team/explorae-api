package br.edu.ifpb.explorae.attraction.service;

import br.edu.ifpb.explorae.attraction.domain.Attraction;
import br.edu.ifpb.explorae.attraction.domain.GeoCoordinate;
import br.edu.ifpb.explorae.attraction.domain.UserInteraction;
import br.edu.ifpb.explorae.attraction.dto.CheckInRequestDTO;
import br.edu.ifpb.explorae.attraction.dto.ProximityCheckInResponseDTO;
import br.edu.ifpb.explorae.attraction.repository.AttractionRepository;
import br.edu.ifpb.explorae.attraction.repository.UserInteractionRepository;
import br.edu.ifpb.explorae.common.exception.BusinessException;
import br.edu.ifpb.explorae.common.exception.ResourceNotFoundException;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Serviço de Check-In por Proximidade Física desenvolvido através do ciclo Red-Green-Refactor do TDD.
 * Valida se o turista está fisicamente presente na atração turística antes de conceder XP e moedas.
 */
@Service
public class ProximityCheckInService {

    public static final double MAX_CHECKIN_RADIUS_METERS = 100.0;
    public static final int DEFAULT_CHECKIN_XP = 50;
    public static final int DEFAULT_CHECKIN_COINS = 10;
    public static final String INTERACTION_TYPE_CHECKIN = "CHECK_IN";

    private final UserRepository userRepository;
    private final AttractionRepository attractionRepository;
    private final UserInteractionRepository userInteractionRepository;
    private final GeoDistanceCalculator geoDistanceCalculator;

    public ProximityCheckInService(
            UserRepository userRepository,
            AttractionRepository attractionRepository,
            UserInteractionRepository userInteractionRepository,
            GeoDistanceCalculator geoDistanceCalculator
    ) {
        this.userRepository = userRepository;
        this.attractionRepository = attractionRepository;
        this.userInteractionRepository = userInteractionRepository;
        this.geoDistanceCalculator = geoDistanceCalculator;
    }

    /**
     * Executa o processo de check-in validando raio de proximidade e prevenindo duplicidades.
     */
    @Transactional
    public ProximityCheckInResponseDTO executeCheckIn(CheckInRequestDTO request) {
        User user = findUserOrThrow(request.userId());
        Attraction attraction = findAttractionOrThrow(request.attractionId());

        GeoCoordinate userLocation = new GeoCoordinate(request.userLatitude(), request.userLongitude());
        GeoCoordinate attractionLocation = new GeoCoordinate(attraction.getLatitude(), attraction.getLongitude());

        double distance = geoDistanceCalculator.calculateDistanceInMeters(userLocation, attractionLocation);

        validateProximityRadius(distance);
        validateDailyCheckInLimit(user.getId(), attraction.getId());

        awardGamificationRewards(user);
        UserInteraction savedInteraction = recordCheckInInteraction(user, attraction);

        return new ProximityCheckInResponseDTO(
                savedInteraction.getId(),
                attraction.getId(),
                attraction.getName(),
                Math.round(distance * 10.0) / 10.0,
                DEFAULT_CHECKIN_XP,
                DEFAULT_CHECKIN_COINS,
                savedInteraction.getCreatedAt()
        );
    }

    private User findUserOrThrow(java.util.UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
    }

    private Attraction findAttractionOrThrow(java.util.UUID attractionId) {
        return attractionRepository.findById(attractionId)
                .orElseThrow(() -> new ResourceNotFoundException("Atração turística não encontrada."));
    }

    private void validateProximityRadius(double distance) {
        if (distance > MAX_CHECKIN_RADIUS_METERS) {
            throw new BusinessException(String.format(
                    "Você está a %.1f metros da atração. O check-in só é permitido a no máximo %.0f metros de distância.",
                    distance, MAX_CHECKIN_RADIUS_METERS
            ));
        }
    }

    private void validateDailyCheckInLimit(java.util.UUID userId, java.util.UUID attractionId) {
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        boolean alreadyCheckedInToday = userInteractionRepository
                .existsByUserIdAndAttractionIdAndInteractionTypeAndCreatedAtAfter(
                        userId, attractionId, INTERACTION_TYPE_CHECKIN, startOfDay
                );

        if (alreadyCheckedInToday) {
            throw new BusinessException("Você já realizou check-in nesta atração hoje. Volte amanhã para explorar novamente!");
        }
    }

    private void awardGamificationRewards(User user) {
        user.addXp(DEFAULT_CHECKIN_XP);
        user.setCoins((user.getCoins() != null ? user.getCoins() : 0) + DEFAULT_CHECKIN_COINS);
        userRepository.save(user);
    }

    private UserInteraction recordCheckInInteraction(User user, Attraction attraction) {
        UserInteraction interaction = UserInteraction.builder()
                .user(user)
                .attraction(attraction)
                .interactionType(INTERACTION_TYPE_CHECKIN)
                .build();
        return userInteractionRepository.save(interaction);
    }
}
