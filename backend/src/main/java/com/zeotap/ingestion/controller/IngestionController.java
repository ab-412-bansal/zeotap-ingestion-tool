package com.zeotap.ingestion.controller;

import com.zeotap.ingestion.service.FileService;
import com.zeotap.ingestion.service.IngestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/ingest")
public class IngestionController {

    @Autowired
    private IngestionService ingestionService;

    @Autowired
    private FileService fileService;

    @PostMapping("/csv-to-clickhouse")
    public ResponseEntity<String> ingestCsvToClickHouse(
            @RequestParam String host,
            @RequestParam String database,
            @RequestParam String user,
            @RequestParam String token,
            @RequestParam String table,
            @RequestParam String fileName,
            @RequestParam String columns
    ) {
        try {
            List<String> selectedColumns = Arrays.asList(columns.split(","));
            String filePath = fileService.getSavedFilePath(fileName);
            int rowsInserted = ingestionService.ingestCsvToClickHouse(
                    filePath, host, database, user, token, table, selectedColumns
            );
            return ResponseEntity.ok("Ingestion completed: " + rowsInserted + " rows inserted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/clickhouse-to-csv")
    public ResponseEntity<String> ingestClickHouseToCsv(
            @RequestParam String host,
            @RequestParam String database,
            @RequestParam String user,
            @RequestParam String token,
            @RequestParam String table,
            @RequestParam String columns
    ) {
        try {
            List<String> selectedColumns = Arrays.asList(columns.split(","));
            String result = ingestionService.exportClickHouseToCsv(
                    host, database, user, token, table, selectedColumns
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/clickhouse-join-to-csv")
    public ResponseEntity<String> joinClickHouseTablesAndExport(
            @RequestParam String host,
            @RequestParam String database,
            @RequestParam String user,
            @RequestParam String token,
            @RequestParam List<String> tables,
            @RequestParam String joinCondition,
            @RequestParam List<String> columns
    ) {
        try {
            String result = ingestionService.joinAndExportToCsv(
                    host, database, user, token, tables, joinCondition, columns
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
