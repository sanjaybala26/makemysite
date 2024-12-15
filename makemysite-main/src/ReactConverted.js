import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';

function ReactConverted() {
  const [selectedFile, setSelectedFile] = useState(null);
  const { state } = useLocation();
  const convertedFiles = state?.convertedFiles || [];

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  return (
    <div className="react-converted-container">
      <h2>Converted React Code and CSS</h2>
      <div className="file-list">
        {convertedFiles.map((file) => (
          <button
            key={file.name}
            onClick={() => handleFileSelect(file)}
            className={selectedFile?.name === file.name ? 'active' : ''}
          >
            {file.name}
          </button>
        ))}
      </div>
      
      <div className="code-editor">
        {selectedFile ? (
          <div>
            <h3>React Code</h3>
            <Editor
              height="40vh"
              language="javascript"
              value={selectedFile.content}
              options={{
                readOnly: true,
                minimap: { enabled: false },
              }}
            />
            
            <h3>CSS Code</h3>
            <Editor
              height="40vh"
              language="css"
              value={selectedFile.cssContent || 'No CSS provided.'} // Display CSS content
              options={{
                readOnly: true,
                minimap: { enabled: false },
              }}
            />
          </div>
        ) : (
          <p>Select a file to view its converted React code and CSS.</p>
        )}
      </div>
    </div>
  );
}

export default ReactConverted;
