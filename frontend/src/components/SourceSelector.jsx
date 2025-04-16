export default function SourceSelector({ source, setSource }) {
    return (
      <div className="mb-4">
        <label className="section-title">Source</label>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="custom-select"
        >
          <option value="">-- Choose Source --</option>
          <option value="clickhouse">ClickHouse</option>
          <option value="flatfile">Flat File (CSV)</option>
        </select>
      </div>
    );
  }