package com.zeotap.ingestion.controller;

import com.zeotap.ingestion.service.ClickHouseService;
import org.springframework.web.bind.annotation.*;

import java.sql.Connection;
import java.util.List;

@RestController
@RequestMapping("/api/clickhouse")
public class ClickHouseController {

    @GetMapping("/connect")
    public List<String> connectAndListTables(
            @RequestParam String host,
            @RequestParam String database,
            @RequestParam String user,
            @RequestParam String token
    ) {
        try (Connection conn = ClickHouseService.connect(host, database, user, token)) {
            return ClickHouseService.listTables(conn);
        } catch (Exception e) {
            return List.of("ERROR: " + e.getMessage());
        }
    }

    @GetMapping("/columns")
    public List<String> getColumns(
            @RequestParam String host,
            @RequestParam String database,
            @RequestParam String user,
            @RequestParam String token,
            @RequestParam String table
    ) {
        try (Connection conn = ClickHouseService.connect(host, database, user, token)) {
            return ClickHouseService.getColumns(conn, table);
        } catch (Exception e) {
            return List.of("ERROR: " + e.getMessage());
        }
    }
}
