package br.edu.ifpb.explorae.api.mapper;

import br.edu.ifpb.explorae.api.dto.AttractionDetailsResponseDTO;
import br.edu.ifpb.explorae.api.dto.AttractionReviewDTO;
import br.edu.ifpb.explorae.domain.attraction.Attraction;
import br.edu.ifpb.explorae.domain.attraction.AttractionReview;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AttractionMapper {

    @Mapping(target = "isSaved", source = "isSaved")
    @Mapping(target = "reviews", source = "reviews")
    AttractionDetailsResponseDTO toDetailsDTO(Attraction attraction, Boolean isSaved, List<AttractionReviewDTO> reviews);

    @Mapping(target = "userName", source = "user.name")
    @Mapping(target = "userPhotoUrl", source = "user.photoUrl")
    AttractionReviewDTO toReviewDTO(AttractionReview review);
}
