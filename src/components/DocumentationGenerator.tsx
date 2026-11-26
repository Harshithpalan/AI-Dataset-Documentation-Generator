import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { DatasetFile, GenerationStatus } from '../types';
import { ollamaService } from '../services/ollama';
import { DatasetParser } from '../services/datasetParser';

interface DocumentationGeneratorProps {
  dataset: DatasetFile | null;
}

export function DocumentationGenerator({ dataset }: DocumentationGeneratorProps) {
  const [status, setStatus] = useState<GenerationStatus>({
    status: 'idle',
    progress: 0,
    message: '',
  });
  const [documentation, setDocumentation] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('llama3.2');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isOllamaConnected, setIsOllamaConnected] = useState(false);

  const checkOllamaConnection = async () => {
    const connected = await ollamaService.checkConnection();
    setIsOllamaConnected(connected);
    if (connected) {
      const models = await ollamaService.listModels();
      setAvailableModels(models);
      if (models.length > 0 && !models.includes(selectedModel)) {
        setSelectedModel(models[0]);
      }
    }
  };

  const handleGenerate = async () => {
    if (!dataset || !dataset.data) {
      setStatus({
        status: 'error',
        progress: 0,
        message: 'No dataset loaded',
      });
      return;
    }

    if (!isOllamaConnected) {
      setStatus({
        status: 'error',
        progress: 0,
        message: 'Ollama is not connected. Please ensure Ollama is running locally.',
      });
      return;
    }

    setStatus({
      status: 'analyzing',
      progress: 10,
      message: 'Analyzing dataset...',
    });

    try {
      const analysis = DatasetParser.analyzeDataset(dataset.data);

      setStatus({
        status: 'generating',
        progress: 30,
        message: 'Generating documentation with AI...',
      });

      const result = await ollamaService.generateDocumentation(analysis, selectedModel);

      setDocumentation(result);
      setStatus({
        status: 'completed',
        progress: 100,
        message: 'Documentation generated successfully!',
      });
    } catch (error) {
      setStatus({
        status: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Failed to generate documentation',
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([documentation], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataset?.name || 'dataset'}-documentation.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!dataset) {
    return (
      <div className="generator-placeholder">
        <p>Upload a dataset to generate documentation</p>
      </div>
    );
  }

  return (
    <div className="documentation-generator">
      <div className="generator-header">
        <h2>Generate Documentation</h2>
        <div className="connection-status">
          <button
            onClick={checkOllamaConnection}
            className={`status-button ${isOllamaConnected ? 'connected' : 'disconnected'}`}
          >
            {isOllamaConnected ? '● Ollama Connected' : '○ Check Ollama Connection'}
          </button>
        </div>
      </div>

      <div className="dataset-info">
        <h3>Dataset: {dataset.name}</h3>
        <p>Records: {dataset.data?.length || 0}</p>
      </div>

      {availableModels.length > 0 && (
        <div className="model-selector">
          <label htmlFor="model-select">Select Model:</label>
          <select
            id="model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={status.status === 'analyzing' || status.status === 'generating' || !isOllamaConnected}
        className="generate-button"
      >
        {status.status === 'analyzing' || status.status === 'generating'
          ? 'Generating...'
          : 'Generate Documentation'}
      </button>

      {status.status !== 'idle' && (
        <div className={`status-message ${status.status}`}>
          <p>{status.message}</p>
          {status.status === 'analyzing' || status.status === 'generating' ? (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${status.progress}%` }}></div>
            </div>
          ) : null}
        </div>
      )}

      {documentation && (
        <div className="documentation-output">
          <div className="documentation-actions">
            <h3>Generated Documentation</h3>
            <button onClick={handleDownload} className="download-button">
              Download Markdown
            </button>
          </div>
          <div className="markdown-preview">
            <ReactMarkdown>{documentation}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
