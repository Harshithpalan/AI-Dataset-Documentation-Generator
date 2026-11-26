import { useState, useRef } from 'react';
import { DatasetFile } from '../types';
import { DatasetParser } from '../services/datasetParser';

interface FileUploadProps {
  onFileLoaded: (file: DatasetFile) => void;
}

export function FileUpload({ onFileLoaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await DatasetParser.parseFile(file);
      const datasetFile: DatasetFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        content: '',
        data,
      };
      onFileLoaded(datasetFile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload-container">
      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.json"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <div className="upload-content">
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Processing file...</p>
            </div>
          ) : (
            <>
              <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="upload-text">
                Drag and drop your dataset file here, or click to browse
              </p>
              <p className="upload-hint">Supported formats: CSV, JSON</p>
            </>
          )}
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
