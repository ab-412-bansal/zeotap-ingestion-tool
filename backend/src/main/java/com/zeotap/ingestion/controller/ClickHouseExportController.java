package com.zeotap.ingestion.controller;

import com.zeotap.ingestion.service.ClickHouseExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/export")
public class ClickHouseExportController {

    @Autowired
    private ClickHouseExportService exportService;

    @GetMapping("/clickhouse-to-csv")
    public ResponseEntity<?> exportClickHouseToCSV(
            @RequestParam String host,
            @RequestParam String database,
            @RequestParam String user,
            @RequestParam String token,
            @RequestParam String table,
            @RequestParam List<String> columns
    ) {
        try {
            String fileName = exportService.exportTableToCsv(host, database, user, token, table, columns);
            return ResponseEntity.ok("✅ Data exported to: " + fileName);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Error: " + e.getMessage());
        }
    }
}
