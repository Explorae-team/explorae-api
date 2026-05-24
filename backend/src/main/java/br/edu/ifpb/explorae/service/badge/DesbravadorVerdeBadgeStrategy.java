package br.edu.ifpb.explorae.service.badge;

import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.repository.AttractionReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DesbravadorVerdeBadgeStrategy implements BadgeProgressStrategy {

    private final AttractionReviewRepository reviewRepository;

    @Override
    public String getBadgeName() {
        return "DESBRAVADOR_VERDE";
    }

    @Override
    public int getTargetValue() {
        return 3;
    }

    @Override
    public int calculateCurrentValue(User user) {
        return (int) reviewRepository.countByUserIdAndAttractionCategoryIgnoreCase(user.getId(), "aventura");
    }
}
