export default function ConnectionForm({ source, formData, setFormData, onConnect }) {
    if (!source) return null;
  
    const handleChange = (e) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
  
    return (
      <div className="mb-4">
        {source === "clickhouse" && (
          <>
            <div className="row mb-3">
              <div className="col-md-8">
                <input 
                  name="host" 
                  value={formData.host || ''}
                  onChange={handleChange} 
                  placeholder="Host" 
                  className="custom-input" 
                />
              </div>
              <div className="col-md-4">
                <button onClick={onConnect} className="purple-button w-100">
                  Connect
                </button>
              </div>
            </div>
            <input 
              name="database" 
              value={formData.database || ''}
              onChange={handleChange} 
              placeholder="Database" 
              className="custom-input" 
            />
            <div className="row">
              <div className="col-md-6">
                <input 
                  name="user" 
                  value={formData.user || ''}
                  onChange={handleChange} 
                  placeholder="User" 
                  className="custom-input" 
                />
              </div>
              <div className="col-md-6">
                <input 
                  name="token" 
                  value={formData.token || ''}
                  onChange={handleChange} 
                  placeholder="Token" 
                  className="custom-input" 
                  type="password"
                />
              </div>
            </div>
          </>
        )}
        {source === "flatfile" && (
          <>
            <input 
              name="fileName" 
              value={formData.fileName || ''}
              onChange={handleChange} 
              placeholder="File name" 
              className="custom-input" 
            />
          </>
        )}
      </div>
    );
  }