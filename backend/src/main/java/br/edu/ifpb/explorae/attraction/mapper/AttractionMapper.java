package br.edu.ifpb.explorae.attraction.mapper;

import br.edu.ifpb.explorae.attraction.dto.AttractionDetailsResponseDTO;
import br.edu.ifpb.explorae.attraction.dto.AttractionReviewDTO;
import br.edu.ifpb.explorae.attraction.domain.Attraction;
import br.edu.ifpb.explorae.attraction.domain.AttractionReview;
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
