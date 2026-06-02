package br.edu.ifpb.explorae.api.mapper;

import br.edu.ifpb.explorae.api.dto.PartnerResponseDTO;
import br.edu.ifpb.explorae.api.dto.RewardResponseDTO;
import br.edu.ifpb.explorae.api.dto.VoucherResponseDTO;
import br.edu.ifpb.explorae.domain.reward.Partner;
import br.edu.ifpb.explorae.domain.reward.Reward;
import br.edu.ifpb.explorae.domain.reward.Voucher;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RewardMapper {

    PartnerResponseDTO toPartnerDTO(Partner partner);

    RewardResponseDTO toRewardDTO(Reward reward);

    List<RewardResponseDTO> toRewardDTOList(List<Reward> rewards);

    @Mapping(target = "userId", source = "user.id")
    VoucherResponseDTO toVoucherDTO(Voucher voucher);

    List<VoucherResponseDTO> toVoucherDTOList(List<Voucher> vouchers);
}
