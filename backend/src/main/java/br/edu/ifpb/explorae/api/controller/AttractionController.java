package br.edu.ifpb.explorae.api.controller;

import br.edu.ifpb.explorae.api.dto.AttractionFiltersDTO;
import br.edu.ifpb.explorae.api.dto.AttractionResponseDTO;
import br.edu.ifpb.explorae.api.dto.StandardResponseDTO;
import br.edu.ifpb.explorae.service.AttractionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/attractions")
public class AttractionController {

    private final AttractionService service;

    public AttractionController(AttractionService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<StandardResponseDTO<Page<AttractionResponseDTO>>> getAll(
            AttractionFiltersDTO filters,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        Page<AttractionResponseDTO> page = service.findAll(filters, pageable);
        return ResponseEntity.ok(StandardResponseDTO.success(
                "Atrações recuperadas com sucesso",
                page
        ));
    }
}
