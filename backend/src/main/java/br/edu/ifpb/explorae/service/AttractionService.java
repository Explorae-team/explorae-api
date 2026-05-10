package br.edu.ifpb.explorae.service;

import br.edu.ifpb.explorae.api.dto.AttractionResponseDTO;
import br.edu.ifpb.explorae.repository.AttractionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AttractionService {

    private final AttractionRepository repository;

    public AttractionService(AttractionRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public Page<AttractionResponseDTO> findAll(Pageable pageable) {
        return repository.findAll(pageable)
                .map(AttractionResponseDTO::fromEntity);
    }
}
