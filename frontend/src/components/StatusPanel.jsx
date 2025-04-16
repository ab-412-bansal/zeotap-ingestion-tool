export default function StatusPanel({ message, isError }) {
    if (!message) return null;
    
    return (
      <div className={`status-panel ${isError ? 'error' : 'success'}`}>
        {message}
      </div>
    );
  }