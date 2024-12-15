import React, { useState, useEffect } from 'react';
import CodeEditor from './Components/CodeEditor';
import LivePreview from './Components/LivePreview';
import ChatBox from './Components/ChatBox';
import { generateCode } from './Services/GeminiAI';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Main() {
  const [files, setFiles] = useState(() => {
    const savedFiles = localStorage.getItem('files');
    return savedFiles ? JSON.parse(savedFiles) : [
      { name: 'index.html', language: 'html', content: '<h1>Hello World</h1>' },
      { name: 'file2.html', language: 'html', content: '<a href="index.html">Go back to index</a>' },
      { name: 'file3.html', language: 'html', content: '<h1>File 3 Content</h1>' },
    ];
  });

  const [currentFile, setCurrentFile] = useState('index.html');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('files', JSON.stringify(files));
  }, [files]);

  const updateFileContent = (newContent) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.name === currentFile ? { ...file, content: newContent } : file
      )
    );
  };

  const handleNewFile = () => {
    const fileName = prompt('Enter the name of the new file:', 'newfile.html');
    if (fileName) {
      const newFile = {
        name: fileName,
        language: 'html',
        content: '',
      };
      setFiles((prevFiles) => [...prevFiles, newFile]);
      setCurrentFile(fileName);
    }
  };

  const handleDeleteFile = () => {
    const fileNameToDelete = prompt('Enter the name of the file to delete:');
    if (fileNameToDelete) {
      setFiles((prevFiles) => prevFiles.filter(file => file.name !== fileNameToDelete));
      // If the deleted file was the current file, switch to the first available file
      if (currentFile === fileNameToDelete && files.length > 1) {
        setCurrentFile(files[0].name);
      }
    }
  };

  const handleConvertToReact = async () => {
    const convertedFiles = await Promise.all(
      files.map(async (file) => {
        // Extract CSS from <style> tag
        const cssMatch = file.content.match(/<style[^>]*>([\s\S]*?)<\/style>/);
        const cssContent = cssMatch ? cssMatch[1].trim() : ''; // Get CSS inside <style> tag
  
        // Convert HTML to React code
        const convertedCode = await generateCode(`Convert this HTML to React.js and don't use hash navigation or unnecessary functions. Convert professionally:\n${file.content}`);
  
        return {
          name: file.name.replace('.html', '.jsx'),
          language: 'javascript',
          content: convertedCode,
          cssContent: cssContent,  // Store the extracted CSS content
        };
      })
    );
  
    navigate('/react-converted', { state: { convertedFiles } });
  };
  

  return (
    <div className="app-container">
      <ChatBox setCode={updateFileContent} />
      <div className="file-list">
        {files.map((file) => (
          <button key={file.name} onClick={() => setCurrentFile(file.name)}>
            {file.name}
          </button>
        ))}
        <button onClick={handleNewFile}>New File</button>
        <button onClick={handleDeleteFile} style={{ marginTop: '10px' }}>Delete File</button>
      </div>
      <div className="main-content">
        <CodeEditor
          fileName={currentFile}
          code={files.find((file) => file.name === currentFile).content}
          setCode={updateFileContent}
        />
        <LivePreview files={files} currentFile={currentFile} setCurrentFile={setCurrentFile} />
      </div>
      <div className='reactbuttoncontainer'>
        <button onClick={handleConvertToReact} style={{ marginTop: '10px' }} className='reactbutton'>Convert to React</button>
      </div>
    </div>
  );
}

export default Main;
