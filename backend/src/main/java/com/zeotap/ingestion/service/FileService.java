package com.zeotap.ingestion.service;

import com.zeotap.ingestion.util.CsvUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.List;

@Service
public class FileService {

    private final String uploadDir = System.getProperty("user.dir") + File.separator + "uploaded_csvs";

    public List<String> handleFileUpload(MultipartFile file) throws Exception {
        // Ensure directory exists
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        File savedFile = new File(dir, file.getOriginalFilename());
        file.transferTo(savedFile);

        try (InputStream is = new FileInputStream(savedFile)) {
            return CsvUtils.extractHeaders(is);
        }
    }

    public String getSavedFilePath(String fileName) {
        return uploadDir + File.separator + fileName;
    }
}
