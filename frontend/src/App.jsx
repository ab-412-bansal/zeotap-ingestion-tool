import { useState } from 'react';
import SourceSelector from './components/SourceSelector';
import ConnectionForm from './components/ConnectionForm';
import ColumnSelector from './components/ColumnSelector';
import FileUploader from './components/FileUploader';
import ActionButtons from './components/ActionButtons';
import ProgressBar from './components/ProgressBar';
import StatusPanel from './components/StatusPanel';
import './styles/custom.css';

export default function App() {
  const [joinEnabled, setJoinEnabled] = useState(false);
  const [joinTables, setJoinTables] = useState([]);
  const [joinCondition, setJoinCondition] = useState("");
  const [source, setSource] = useState('');
  const [formData, setFormData] = useState({});
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [availableTables, setAvailableTables] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    if (!formData.host || !formData.database || !formData.user) {
      setStatus('Please fill in all connection fields');
      setIsError(true);
      return;
    }
    
    setStatus('Testing connection...');
    setIsError(false);
    setLoading(true);
    
    try {
      // For both ClickHouse and flatfile, we need to test connection
      const params = new URLSearchParams({
        host: formData.host,
        database: formData.database,
        user: formData.user,
        token: formData.token || '',
      });
      
      const response = await fetch(`http://localhost:8080/api/clickhouse/connect?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const tables = await response.json();
      
      if (tables[0]?.startsWith('ERROR:')) {
        throw new Error(tables[0].substring(7)); // Remove "ERROR: " prefix
      }
      
      setAvailableTables(tables);
      setStatus(`Connected successfully. Found ${tables.length} tables.`);
      setIsConnected(true);
    } catch (error) {
      console.error("Connection error:", error);
      setStatus('Connection failed: ' + error.message);
      setIsError(true);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    setStatus('Uploading file...');
    setIsError(false);
    setProgress(30);
    setLoading(true);
    
    try {
      const form = new FormData();
      form.append("file", file);
      
      const res = await fetch("http://localhost:8080/api/file/upload", {
        method: "POST",
        body: form,
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setColumns(data);
      setSelectedColumns(data); // Select all columns by default
      setUploadedFileName(file.name);
      setStatus(`File "${file.name}" uploaded successfully. ${data.length} columns found.`);
      setProgress(100);
      setIsError(false);
    } catch (error) {
      console.error("Upload error:", error);
      setStatus('File upload failed: ' + error.message);
      setIsError(true);
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadColumns = async () => {
    if (!formData.host || !formData.database || !formData.user || !formData.table) {
      setStatus('Please fill in all connection fields including table name');
      setIsError(true);
      return;
    }
    
    setStatus('Loading columns...');
    setIsError(false);
    setLoading(true);
    
    try {
      const params = new URLSearchParams({
        host: formData.host,
        database: formData.database,
        user: formData.user,
        token: formData.token || '',
        table: formData.table
      });
      
      const response = await fetch(`http://localhost:8080/api/clickhouse/columns?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const columnData = await response.json();
      
      if (columnData[0]?.startsWith('ERROR:')) {
        throw new Error(columnData[0].substring(7)); // Remove "ERROR: " prefix
      }
      
      setColumns(columnData);
      setSelectedColumns(columnData); // Select all columns by default
      setStatus(`Loaded ${columnData.length} columns from table ${formData.table}`);
      setIsError(false);
    } catch (error) {
      console.error("Error loading columns:", error);
      setStatus('Failed to load columns: ' + error.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    if (columns.length === 0) {
      setStatus('No columns available for preview');
      setIsError(true);
      return;
    }
    
    // For now, just display a message
    setStatus('Preview functionality is not implemented yet.');
    setIsError(false);
  };

  const handleIngest = async () => {
    if (selectedColumns.length === 0) {
      setStatus('Please select at least one column');
      setIsError(true);
      return;
    }
    
    if (source === 'flatfile' && !uploadedFileName) {
      setStatus('Please upload a file first');
      setIsError(true);
      return;
    }
    
    if (!formData.host || !formData.database || !formData.user || !formData.table) {
      setStatus('Please fill in all connection fields');
      setIsError(true);
      return;
    }
    
    setLoading(true);
    setProgress(20);
    setStatus('Ingestion started');
    setIsError(false);
    
    try {
      if (source === "clickhouse" && joinEnabled) {
        const params = new URLSearchParams();
        params.append("host", formData.host);
        params.append("database", formData.database);
        params.append("user", formData.user);
        params.append("token", formData.token || '');
        joinTables.forEach(t => params.append("tables", t));
        params.append("joinCondition", joinCondition);
        selectedColumns.forEach(col => params.append("columns", col));
      
        const url = `http://localhost:8080/api/ingest/clickhouse-join-to-csv?${params}`;
      
        const res = await fetch(url);
        if (!res.ok) throw new Error(await res.text());
        const text = await res.text();
        setStatus(text);
      }
      else if(source === "clickhouse") {
        // For ClickHouse to CSV - using your ClickHouseExportController
        const params = new URLSearchParams();
        params.append('host', formData.host);
        params.append('database', formData.database);
        params.append('user', formData.user);
        params.append('token', formData.token || '');
        params.append('table', formData.table);
        
        // Your controller expects a List<String> for columns
        selectedColumns.forEach(col => {
          params.append('columns', col);
        });
        
        const url = `http://localhost:8080/api/ingest/clickhouse-to-csv?${params}`;
        
        setProgress(40);
        const res = await fetch(url);
        setProgress(80);
        
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || 'Server error');
        }
        
        const text = await res.text();
        setStatus(text);
      } else {
        // For CSV to ClickHouse
        const params = new URLSearchParams();
        params.append('host', formData.host);
        params.append('database', formData.database);
        params.append('user', formData.user);
        params.append('token', formData.token || '');
        params.append('table', formData.table);
        params.append('fileName', uploadedFileName);
        params.append('columns', selectedColumns.join(','));
        
        const url = `http://localhost:8080/api/ingest/csv-to-clickhouse`;
        
        setProgress(40);
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString()
        });
        setProgress(80);
        
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || 'Server error');
        }
        
        const text = await res.text();
        setStatus(text);
      }
      
      setIsError(false);
      setProgress(100);
    } catch (error) {
      console.error("Ingestion error:", error);
      setStatus("Ingestion failed: " + error.message);
      setIsError(true);
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  // Render a dropdown for table selection if connected
  const renderTableSelector = () => {
    if (isConnected && availableTables.length > 0) {
      return (
        <div className="form-group mb-3">
          <label htmlFor="table-select">Select Table</label>
          <select
            className="form-control"
            id="table-select"
            value={formData.table || ''}
            onChange={(e) => {
              setFormData({...formData, table: e.target.value});
              if (e.target.value) {
                // Auto-load columns when a table is selected
                setTimeout(() => handleLoadColumns(), 100);
              }
            }}
          >
            <option value="">-- Select a table --</option>
            {availableTables.map((table, idx) => (
              <option key={idx} value={table}>{table}</option>
            ))}
          </select>
        </div>
      );
    }
    return null;
  };

  return (
  <div className="container py-5">
    <h1 className="text-center mb-5 fw-bold text-gradient">
      Zeotap Data Ingestion Tool
    </h1>

    <div className="main-card">
      <SourceSelector source={source} setSource={setSource} />

      {/* JOIN Toggle (only for ClickHouse) */}
      {source === 'clickhouse' && (
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="joinToggle"
            checked={joinEnabled}
            onChange={() => {
              setJoinEnabled(!joinEnabled);
              setJoinTables([]);
              setJoinCondition('');
            }}
          />
          <label className="form-check-label" htmlFor="joinToggle">
            Enable JOIN Mode
          </label>
        </div>
      )}

      <ConnectionForm
        source={source}
        formData={formData}
        setFormData={setFormData}
        onConnect={handleConnect}
      />

      {/* JOIN Mode Controls */}
      {isConnected && joinEnabled && availableTables.length > 0 && (
        <>
          <div className="form-group mb-3">
            <label>Select Tables to Join:</label>
            <select
              multiple
              className="form-control"
              value={joinTables}
              onChange={(e) =>
                setJoinTables(Array.from(e.target.selectedOptions, (opt) => opt.value))
              }
            >
              {availableTables.map((table, idx) => (
                <option key={idx} value={table}>
                  {table}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mb-3">
            <label>JOIN Condition</label>
            <input
              className="form-control"
              type="text"
              placeholder="e.g., table1.id = table2.foreign_id"
              value={joinCondition}
              onChange={(e) => setJoinCondition(e.target.value)}
            />
          </div>
        </>
      )}

      {/* Table Dropdown (if not JOIN mode) */}
      {isConnected && !joinEnabled && renderTableSelector()}

      {/* File Uploader (Flat File Source) */}
      {source === 'flatfile' && formData.table && (
        <FileUploader onUpload={handleUpload} />
      )}

      {/* Column Selection */}
      <div className="row">
        <div className="col-md-12">
          {columns.length > 0 && (
            <ColumnSelector
              columns={columns}
              selected={selectedColumns}
              setSelected={setSelectedColumns}
            />
          )}
        </div>
      </div>

      {/* Progress Bar + Status Message */}
      <ProgressBar percent={progress} />
      {status && <StatusPanel message={status} isError={isError} />}

      {/* Action Buttons */}
      {columns.length > 0 && (
        <ActionButtons
          onPreview={handlePreview}
          onLoadColumns={handleLoadColumns}
          onIngest={handleIngest}
          loading={loading}
          source={source}
        />
      )}
    </div>
  </div>
);
}