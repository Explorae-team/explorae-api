package br.edu.ifpb.explorae.service.badge;

import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.repository.SavedAttractionRepository;
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
