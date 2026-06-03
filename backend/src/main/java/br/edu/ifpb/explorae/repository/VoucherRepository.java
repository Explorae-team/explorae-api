package br.edu.ifpb.explorae.repository;

import br.edu.ifpb.explorae.domain.reward.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, UUID> {
    List<Voucher> findByUserIdOrderByRedeemedAtDesc(UUID userId);
}
