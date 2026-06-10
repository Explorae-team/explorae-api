package br.edu.ifpb.explorae.user.repository;

import br.edu.ifpb.explorae.user.domain.TravelPreference;
import br.edu.ifpb.explorae.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TravelPreferenceRepository extends JpaRepository<TravelPreference, UUID> {
    Optional<TravelPreference> findByUser(User user);
    Optional<TravelPreference> findByUserId(UUID userId);
}
