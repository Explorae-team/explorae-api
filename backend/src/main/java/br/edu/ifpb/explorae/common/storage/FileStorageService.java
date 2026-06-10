package br.edu.ifpb.explorae.common.storage;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String saveFile(MultipartFile file, String subDirectory);
    void deleteFile(String fileUrl);
}
