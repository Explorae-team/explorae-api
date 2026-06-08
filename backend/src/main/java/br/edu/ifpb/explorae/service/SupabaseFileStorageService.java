package br.edu.ifpb.explorae.service;

import br.edu.ifpb.explorae.api.exception.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@Primary // Define esta como a implementação principal para o Spring injetar nos controllers
public class SupabaseFileStorageService implements FileStorageService {

    private final String supabaseUrl;
    private final String supabaseKey;
    private final RestClient restClient;

    public SupabaseFileStorageService(
            @Value("${SUPABASE_URL}") String supabaseUrl,
            @Value("${SUPABASE_KEY}") String supabaseKey) {
        this.supabaseUrl = supabaseUrl;
        this.supabaseKey = supabaseKey;
        this.restClient = RestClient.builder()
                .baseUrl(supabaseUrl + "/storage/v1/object")
                .defaultHeader("apikey", supabaseKey)
                .defaultHeader("Authorization", "Bearer " + supabaseKey)
                .build();
    }

    @Override
    public String saveFile(MultipartFile file, String bucketName) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = "";

        int i = originalFileName.lastIndexOf('.');
        if (i > 0) {
            extension = originalFileName.substring(i);
        }

        // Gera um nome único para o arquivo no Storage
        String fileName = UUID.randomUUID().toString() + extension;
        String filePath = fileName;

        try {
            // Upload para o Supabase Storage via REST API
            restClient.post()
                    .uri("/{bucket}/{path}", bucketName, filePath)
                    .header("Content-Type", file.getContentType())
                    .body(file.getBytes())
                    .retrieve()
                    .toBodilessEntity();

            // Retorna a URL pública do arquivo
            return String.format("%s/storage/v1/object/public/%s/%s", 
                    supabaseUrl, bucketName, filePath);
            
        } catch (IOException ex) {
            throw new BusinessException("Falha ao ler os bytes do arquivo: " + fileName);
        } catch (Exception ex) {
            throw new BusinessException("Falha ao fazer upload para o Supabase: " + ex.getMessage());
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || !fileUrl.contains("/storage/v1/object/public/")) return;

        try {
            // Extrai o bucket e o path da URL
            // URL format: https://.../storage/v1/object/public/bucket/path
            String part = fileUrl.split("/public/")[1];
            String bucketName = part.split("/")[0];
            String filePath = part.substring(bucketName.length() + 1);

            restClient.delete()
                    .uri("/{bucket}/{path}", bucketName, filePath)
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception ex) {
            // Ignora erro na deleção para não quebrar fluxo principal
        }
    }
}
