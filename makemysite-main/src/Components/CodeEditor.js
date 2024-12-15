import React from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ fileName, code, setCode }) {
  return (
    <div className="code-editor">
      <div className="file-name">
        <h3>{fileName}</h3>  {/* Display the file name */}
      </div>
      <Editor
        height="50vh"
        defaultLanguage="html"
        value={code}
        onChange={(value) => setCode(value)}
      />
    </div>
  );
}

export default CodeEditor;
