package br.edu.ifpb.explorae.repository;

import br.edu.ifpb.explorae.domain.reward.Reward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RewardRepository extends JpaRepository<Reward, UUID> {
    List<Reward> findByIsActiveTrueAndStockGreaterThan(Integer stock);
}
