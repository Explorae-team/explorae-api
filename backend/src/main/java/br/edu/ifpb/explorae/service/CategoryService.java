package br.edu.ifpb.explorae.service;

import br.edu.ifpb.explorae.api.dto.CategoryResponseDTO;
import br.edu.ifpb.explorae.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponseDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(cat -> new CategoryResponseDTO(
                        cat.getId(),
                        cat.getSlug(),
                        cat.getName(),
                        cat.getIconName(),
                        cat.getParentCategory()
                ))
                .collect(Collectors.toList());
    }
}
