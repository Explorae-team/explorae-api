package br.edu.ifpb.explorae.gamification.mapper;

import br.edu.ifpb.explorae.gamification.dto.PartnerResponseDTO;
import br.edu.ifpb.explorae.gamification.dto.RewardResponseDTO;
import br.edu.ifpb.explorae.gamification.dto.VoucherResponseDTO;
import br.edu.ifpb.explorae.gamification.domain.Partner;
import br.edu.ifpb.explorae.gamification.domain.Reward;
import br.edu.ifpb.explorae.gamification.domain.Voucher;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RewardMapper {

    PartnerResponseDTO toPartnerDTO(Partner partner);

    RewardResponseDTO toRewardDTO(Reward reward);

    List<RewardResponseDTO> toRewardDTOList(List<Reward> rewards);

    @Mapping(target = "userId", source = "user.id")
    VoucherResponseDTO toVoucherDTO(Voucher voucher);

    List<VoucherResponseDTO> toVoucherDTOList(List<Voucher> vouchers);
}
