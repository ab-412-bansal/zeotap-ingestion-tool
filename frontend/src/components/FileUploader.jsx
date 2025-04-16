export default function FileUploader({ onUpload }) {
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        onUpload(file);
      }
    };
  
    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onUpload(e.dataTransfer.files[0]);
      }
    };
  
    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
  
    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.classList.add('drag-active');
    };
  
    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.classList.remove('drag-active');
    };
  
    return (
      <div 
        className="dropzone mb-4"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input').click()}
      >
        <div className="upload-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 17V7M12 7L8 11M12 7L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 15V16C3 18.2091 4.79086 20 7 20H17C19.2091 20 21 18.2091 21 16V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p className="mb-0">Drag and drop a file</p>
          <p className="text-muted">here or click to upload</p>
        </div>
        <input 
          id="file-input"
          type="file" 
          accept=".csv"
          onChange={handleFileChange} 
          className="d-none"
        />
      </div>
    );
  }