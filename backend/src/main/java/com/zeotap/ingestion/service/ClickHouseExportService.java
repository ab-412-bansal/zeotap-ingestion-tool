package com.zeotap.ingestion.service;

import java.io.FileWriter;
import java.sql.*;
import java.util.List;
import java.util.Properties;

import com.opencsv.CSVWriter;
import org.springframework.stereotype.Service;

@Service
public class ClickHouseExportService {

    public String exportTableToCsv(String host, String database, String user, String token,
                                   String table, List<String> columns) throws Exception {

        String jdbcUrl = "jdbc:clickhouse://" + host + "/" + database + "?compress=0";
        Properties props = new Properties();
        props.setProperty("user", user);
        props.setProperty("password", token);

        Connection conn = DriverManager.getConnection(jdbcUrl, props);

        String colList = String.join(", ", columns);
        String query = "SELECT " + colList + " FROM " + table;

        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery(query);

        String filename = "exported_data_" + System.currentTimeMillis() + ".csv";
        FileWriter outputfile = new FileWriter("exports/" + filename);
        CSVWriter writer = new CSVWriter(outputfile);

        writer.writeNext(columns.toArray(new String[0]));

        while (rs.next()) {
            String[] row = new String[columns.size()];
            for (int i = 0; i < columns.size(); i++) {
                row[i] = rs.getString(columns.get(i));
            }
            writer.writeNext(row);
        }

        writer.close();
        return filename;
    }
}
