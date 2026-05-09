package br.edu.ifpb.explorae.service;

import br.edu.ifpb.explorae.api.dto.TravelPreferenceRequestDTO;
import br.edu.ifpb.explorae.domain.user.TravelPreference;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.repository.TravelPreferenceRepository;
import br.edu.ifpb.explorae.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.Arrays;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class TravelPreferenceService {

    private final TravelPreferenceRepository travelPreferenceRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<String> getPreferences(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return travelPreferenceRepository.findByUser(user)
                .map(p -> {
                    if (p.getInterests() == null || p.getInterests().isEmpty()) {
                        return new ArrayList<String>();
                    }
                    return Arrays.asList(p.getInterests().split(","));
                })
                .orElse(new ArrayList<String>());
    }

    @Transactional
    public void updatePreferences(UUID userId, TravelPreferenceRequestDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        TravelPreference preference = travelPreferenceRepository.findByUser(user)
                .orElse(new TravelPreference());

        if (preference.getUser() == null) {
            preference.setUser(user);
        }

        if (dto.interests() != null) {
            String interestsJoined = String.join(",", dto.interests());
            preference.setInterests(interestsJoined);
        }

        travelPreferenceRepository.save(preference);
    }
}
