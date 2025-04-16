export default function ColumnSelector({ columns, selected, setSelected }) {
    const toggleColumn = (col) => {
      setSelected((prev) =>
        prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
      );
    };
  
    return (
      <div className="mb-4">
        <label className="section-title">Columns</label>
        <div className="columns-grid">
          {columns.map((col) => (
            <div key={col} className="checkbox-container d-flex align-items-center">
              <div 
                className={`custom-checkbox ${selected.includes(col) ? 'checked' : ''}`}
                onClick={() => toggleColumn(col)}
              >
                {selected.includes(col) && (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span>{col}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }