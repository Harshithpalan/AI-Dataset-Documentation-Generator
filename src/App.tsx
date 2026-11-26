import { useState } from 'react';
import { Auth } from './components/Auth';
import { FileUpload } from './components/FileUpload';
import { DocumentationGenerator } from './components/DocumentationGenerator';
import { User, DatasetFile } from './types';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [dataset, setDataset] = useState<DatasetFile | null>(null);

  const handleLoginSuccess = (user: User) => {
    setUser(user);
  };

  const handleLogout = () => {
    setUser(null);
    setDataset(null);
  };

  const handleFileLoaded = (file: DatasetFile) => {
    setDataset(file);
  };

  const handleResetDataset = () => {
    setDataset(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Dataset Documentation Generator</h1>
        <Auth user={user} onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />
      </header>

      <main className="app-main">
        {!user ? (
          <div className="welcome-screen">
            <h2>Welcome to AI Dataset Documentation Generator</h2>
            <p>
              Generate comprehensive documentation for your datasets using local AI models.
              Sign in with Google to get started.
            </p>
            <div className="features">
              <div className="feature">
                <h3>📁 Upload Datasets</h3>
                <p>Support for CSV and JSON files</p>
              </div>
              <div className="feature">
                <h3>🤖 AI-Powered</h3>
                <p>Uses local LLM via Ollama</p>
              </div>
              <div className="feature">
                <h3>📝 Auto-Generate</h3>
                <p>Comprehensive documentation with schema, examples, and usage</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="app-content">
            {!dataset ? (
              <div className="upload-section">
                <h2>Upload Your Dataset</h2>
                <FileUpload onFileLoaded={handleFileLoaded} />
              </div>
            ) : (
              <div className="generator-section">
                <button onClick={handleResetDataset} className="back-button">
                  ← Upload Different Dataset
                </button>
                <DocumentationGenerator dataset={dataset} />
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by React, Vite, and Ollama</p>
      </footer>
    </div>
  );
}

export default App;
