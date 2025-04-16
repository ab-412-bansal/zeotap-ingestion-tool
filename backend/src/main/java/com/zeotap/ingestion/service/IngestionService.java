package com.zeotap.ingestion.service;

import com.opencsv.CSVReader;
import org.springframework.stereotype.Service;

import java.io.*;
import java.sql.*;
import java.util.*;

@Service
public class IngestionService {

    public int ingestCsvToClickHouse(
            String filePath,
            String host,
            String database,
            String user,
            String token,
            String table,
            List<String> selectedColumns
    ) throws Exception {
        String jdbcUrl = "jdbc:clickhouse://" + host + "/" + database + "?compress=0";

        Properties props = new Properties();
        props.setProperty("user", user);
        props.setProperty("password", token);

        try (
                Connection conn = DriverManager.getConnection(jdbcUrl, props);
                FileReader fr = new FileReader(filePath);
                CSVReader reader = new CSVReader(fr)
        ) {
            String[] headers = reader.readNext();
            if (headers == null) throw new Exception("Empty file");

            List<Integer> colIndexes = new ArrayList<>();
            for (String col : selectedColumns) {
                int index = Arrays.asList(headers).indexOf(col);
                if (index == -1) throw new Exception("Column not found: " + col);
                colIndexes.add(index);
            }

            String columnsJoined = String.join(", ", selectedColumns);
            String placeholders = String.join(", ", Collections.nCopies(selectedColumns.size(), "?"));
            String query = "INSERT INTO " + table + " (" + columnsJoined + ") VALUES (" + placeholders + ")";
            PreparedStatement stmt = conn.prepareStatement(query);

            String[] row;
            int count = 0;
            while ((row = reader.readNext()) != null) {
                for (int i = 0; i < colIndexes.size(); i++) {
                    stmt.setString(i + 1, row[colIndexes.get(i)]);
                }
                stmt.addBatch();
                count++;
                if (count % 1000 == 0) stmt.executeBatch();
            }
            stmt.executeBatch();
            return count;
        }
    }

    public String exportClickHouseToCsv(
            String host,
            String database,
            String user,
            String token,
            String table,
            List<String> columns
    ) throws Exception {
        String jdbcUrl = "jdbc:clickhouse://" + host + "/" + database + "?compress=0";
        Properties props = new Properties();
        props.setProperty("user", user);
        props.setProperty("password", token);

        String fileName = "export_" + table + ".csv";
        try (
                Connection conn = DriverManager.getConnection(jdbcUrl, props);
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery("SELECT " + String.join(",", columns) + " FROM " + table);
                FileWriter fw = new FileWriter(fileName)
        ) {
            ResultSetMetaData meta = rs.getMetaData();
            int colCount = meta.getColumnCount();

            // Write headers
            for (int i = 1; i <= colCount; i++) {
                fw.write(meta.getColumnName(i));
                if (i < colCount) fw.write(",");
            }
            fw.write("\n");

            // Write rows
            while (rs.next()) {
                for (int i = 1; i <= colCount; i++) {
                    fw.write(rs.getString(i));
                    if (i < colCount) fw.write(",");
                }
                fw.write("\n");
            }
            return "Exported CSV: " + fileName;
        }
    }

    public String joinAndExportToCsv(
            String host,
            String database,
            String user,
            String token,
            List<String> tables,
            String joinCondition,
            List<String> columns
    ) throws Exception {
        String jdbcUrl = "jdbc:clickhouse://" + host + "/" + database + "?compress=0";
        Properties props = new Properties();
        props.setProperty("user", user);
        props.setProperty("password", token);

        String query = "SELECT " + String.join(",", columns) +
                " FROM " + String.join(" JOIN ", tables) +
                " ON " + joinCondition;

        String fileName = "joined_export.csv";
        try (
                Connection conn = DriverManager.getConnection(jdbcUrl, props);
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(query);
                FileWriter fw = new FileWriter(fileName)
        ) {
            ResultSetMetaData meta = rs.getMetaData();
            int colCount = meta.getColumnCount();

            for (int i = 1; i <= colCount; i++) {
                fw.write(meta.getColumnName(i));
                if (i < colCount) fw.write(",");
            }
            fw.write("\n");

            while (rs.next()) {
                for (int i = 1; i <= colCount; i++) {
                    fw.write(rs.getString(i));
                    if (i < colCount) fw.write(",");
                }
                fw.write("\n");
            }
            return "Joined CSV exported to " + fileName;
        }
    }
}
