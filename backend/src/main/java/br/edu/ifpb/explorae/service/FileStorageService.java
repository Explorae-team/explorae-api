package br.edu.ifpb.explorae.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String saveFile(MultipartFile file, String subDirectory);
    void deleteFile(String fileUrl);
}
