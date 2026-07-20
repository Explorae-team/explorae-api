package br.edu.ifpb.explorae.common.storage;

import br.edu.ifpb.explorae.common.exception.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalFileStorageService implements FileStorageService {

    private final Path fileStorageLocation;

    public LocalFileStorageService(@Value("${app.upload.dir:uploads}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            // Garante a existência do diretório raiz para evitar erros de E/S na primeira execução.
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new BusinessException("Não foi possível criar o diretório de uploads.");
        }
    }

    @Override
    public String saveFile(MultipartFile file, String subDirectory) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = "";

        int i = originalFileName.lastIndexOf('.');
        if (i > 0) {
            extension = originalFileName.substring(i);
        }

        // Gera um nome único via UUID para evitar conflitos entre arquivos de usuários diferentes.
        String fileName = UUID.randomUUID().toString() + extension;

        try {
            Path targetLocation = this.fileStorageLocation.resolve(subDirectory).resolve(fileName);
            Files.createDirectories(targetLocation.getParent());
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Retorna o caminho relativo (URL) que será usado pelo frontend e servido pelo WebConfig.
            return "/uploads/" + subDirectory + "/" + fileName;
        } catch (IOException ex) {
            throw new BusinessException("Falha ao salvar o arquivo: " + fileName);
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || !fileUrl.startsWith("/uploads/")) return;

        try {
            // Converte a URL de volta para o caminho absoluto no sistema para limpeza de arquivos órfãos.
            String fileName = fileUrl.replace("/uploads/", "");
            Path filePath = this.fileStorageLocation.resolve(fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            // Ignora falhas na deleção para não interromper fluxos de negócio se o arquivo já não existir.
        }
    }
}
