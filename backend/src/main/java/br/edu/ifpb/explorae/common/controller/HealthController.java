package br.edu.ifpb.explorae.common.controller;
import br.edu.ifpb.explorae.user.domain.User;

import br.edu.ifpb.explorae.common.dto.StandardResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<StandardResponseDTO<Map<String, String>>> check() {
        var status = Map.of(
            "status", "UP",
            "message", "Explorae User Service is running"
        );
        return ResponseEntity.ok(StandardResponseDTO.success("Sistema Operacional", status));
    }
}
