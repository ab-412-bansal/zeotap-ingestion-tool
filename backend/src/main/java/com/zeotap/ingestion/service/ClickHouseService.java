package com.zeotap.ingestion.service;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class ClickHouseService {

    public static Connection connect(String host, String database, String user, String jwtToken) throws SQLException {
        String jdbcUrl = "jdbc:clickhouse://" + host + "/" + database + "?compress=0";

        Properties props = new Properties();
        props.setProperty("user", user);
        props.setProperty("password", jwtToken); // JWT passed as password

        return DriverManager.getConnection(jdbcUrl, props);
    }

    public static List<String> listTables(Connection conn) throws SQLException {
        List<String> tables = new ArrayList<>();
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("SHOW TABLES");
        while (rs.next()) {
            tables.add(rs.getString(1));
        }
        return tables;
    }

    public static List<String> getColumns(Connection conn, String tableName) throws SQLException {
        List<String> columns = new ArrayList<>();
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("DESCRIBE TABLE " + tableName);
        while (rs.next()) {
            columns.add(rs.getString(1)); // column name is first column
        }
        return columns;
    }
}
