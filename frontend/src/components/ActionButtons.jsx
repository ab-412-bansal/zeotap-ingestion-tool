export default function ActionButtons({ onPreview, onLoadColumns, onIngest, loading }) {
    return (
      <div className="d-flex gap-3 mt-4">
        <button
          onClick={onPreview}
          className="outline-button flex-grow-1"
          disabled={loading}
        >
          Preview
        </button>
        <button
          onClick={onLoadColumns}
          className="purple-button flex-grow-1"
          disabled={loading}
        >
          Load Columns
        </button>
        <button
          onClick={onIngest}
          className="purple-button flex-grow-1"
          disabled={loading}
        >
          {loading ? "Processing..." : "Start Ingestion"}
        </button>
      </div>
    );
  }