package br.edu.ifpb.explorae.attraction.dto;

import lombok.Data;

@Data
public class AttractionFiltersDTO {
    private String name;
    private String category;
    private Integer minPrice;
    private Integer maxPrice;
    private Double minRating;
    private Boolean isPartner;
}
