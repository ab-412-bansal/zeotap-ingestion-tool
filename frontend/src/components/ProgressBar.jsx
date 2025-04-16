export default function ProgressBar({ percent }) {
    if (percent <= 0) return null;
    
    return (
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <label className="section-title mb-0">Status</label>
          {percent > 0 && <span>{percent}% {percent < 100 ? 'Ingesting...' : 'Complete'}</span>}
        </div>
        <div className="custom-progress">
          <div 
            className="progress-bar" 
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    );
  }