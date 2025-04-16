# Zeotap Data Ingestion Tool

A web-based bidirectional ingestion platform built for Zeotap that enables seamless data transfer between **ClickHouse** and **Flat File (CSV)** sources. Built with **Java (Spring Boot)** and **React**, the tool supports authentication, selective column ingestion, JOIN support, and data preview.

---

## 🚀 Features

- 🔄 **Bidirectional Ingestion**  
  - ClickHouse ➝ CSV  
  - CSV ➝ ClickHouse  

- 🔐 **JWT Auth Support**  
  Secure connection with JWT token for ClickHouse

- 🗂️ **Schema Discovery**  
  - Auto-load tables and columns  
  - Supports multiple JOINed tables

- ✅ **Column Selector**  
  Pick specific columns to ingest/export

- 📦 **Drag-and-Drop CSV Upload**

- 📊 **Progress Indicator + Status Panel**

- 🔗 **JOIN Support**  
  Select multiple tables and define join conditions (Bonus)

---

## 🛠️ Tech Stack

| Layer      | Tech                    |
|------------|-------------------------|
| Frontend   | React, Bootstrap, JS    |
| Backend    | Spring Boot (Java)      |
| Database   | ClickHouse (Docker)     |
| File Format| CSV                     |

---

## 🧩 Setup Instructions

### 1. Prerequisites
- Java 17+
- Node.js 16+
- Docker

### 2. Start ClickHouse with Docker

```bash
docker run -d --name clickhouse -p 8123:8123 clickhouse/clickhouse-server
```

## 🛠️ Backend Setup

```bash
cd zeotap-ingestion-tool/backend
mvn clean install
mvn spring-boot:run
```

---

## 💻 Frontend Setup

```bash
cd zeotap-ingestion-tool/frontend
npm install
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint                             | Description                              |
|--------|--------------------------------------|------------------------------------------|
| GET    | `/api/clickhouse/connect`            | Connect & list ClickHouse tables         |
| GET    | `/api/clickhouse/columns`            | Get columns from table                   |
| POST   | `/api/file/upload`                   | Upload CSV and extract headers           |
| POST   | `/api/ingest/csv-to-clickhouse`      | Ingest CSV data to ClickHouse            |
| GET    | `/api/ingest/clickhouse-to-csv`      | Export ClickHouse data to CSV            |
| GET    | `/api/ingest/clickhouse-join-to-csv` | BONUS: Export result of JOIN to CSV      |

---

## ✅ Testing Plan

| Test Case                                | Status    |
|------------------------------------------|-----------|
| ClickHouse ➝ Flat File (CSV)            | ✅ Passed |
| Flat File ➝ ClickHouse                  | ✅ Passed |
| JOIN (multi-table + condition) ➝ CSV    | ✅ Passed |
| Auth / Connection Failures               | ✅ Passed |
| Preview Handling                         | ❌ Skipped |

---

## 📂 Project Structure

```plaintext
zeotap-ingestion-tool/
├── backend/
│   └── src/main/java/com/zeotap/ingestion/...
├── frontend/
│   └── src/components/
│   └── src/App.jsx
│   └── src/styles/custom.css
├── prompts.txt
└── README.md
```

---


## 🤖 AI Usage

AI tools like **ChatGPT** were used for:

- Project structure and architecture
- Spring Boot controller/service logic
- React component scaffolding
- Implementing JOIN query logic
- Handling error scenarios and frontend UX

All prompts are recorded in [`prompts.txt`](./prompts.txt)

---

## 👤 Author

**Ayush Bansal**  
Software Engineer Intern Candidate – Zeotap  
📧 Email: ayush4bansal@gmail.com  
🔗 GitHub: [https://github.com/ay-412-bansal](https://github.com/ay-412-bansal)
