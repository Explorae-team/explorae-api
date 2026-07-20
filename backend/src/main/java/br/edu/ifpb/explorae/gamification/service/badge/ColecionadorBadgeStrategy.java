package br.edu.ifpb.explorae.gamification.service.badge;

import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.attraction.repository.SavedAttractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ColecionadorBadgeStrategy implements BadgeProgressStrategy {

    private final SavedAttractionRepository savedAttractionRepository;

    @Override
    public String getBadgeName() {
        return "COLECIONADOR";
    }

    @Override
    public int getTargetValue() {
        return 1;
    }

    @Override
    public int calculateCurrentValue(User user) {
        return (int) savedAttractionRepository.countByUserId(user.getId());
    }
}
