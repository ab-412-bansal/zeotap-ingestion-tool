package com.zeotap.ingestion.util;

import com.opencsv.CSVReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.List;

public class CsvUtils {
    public static List<String> extractHeaders(InputStream inputStream) throws Exception {
        try (CSVReader csvReader = new CSVReader(new InputStreamReader(inputStream))) {
            String[] headers = csvReader.readNext();
            if (headers == null) {
                throw new Exception("No headers found in CSV.");
            }
            return Arrays.asList(headers);
        }
    }
}
