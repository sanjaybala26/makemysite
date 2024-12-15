import React, { useEffect, useRef, useState } from 'react';

function LivePreview({ files, currentFile, setCurrentFile }) {
  const iframeRef = useRef(null);

  // Function to render content in the iframe
  const renderContent = () => {
    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

    const file = files.find((f) => f.name === currentFile);
    if (file) {
      let htmlContent = file.content;

      // Add CSS files
      const cssFiles = files.filter((f) => f.language === 'css');
      cssFiles.forEach((cssFile) => {
        htmlContent += `<style>${cssFile.content}</style>`;
      });

      // Add JS files
      const jsFiles = files.filter((f) => f.language === 'javascript');
      jsFiles.forEach((jsFile) => {
        htmlContent += `<script>${jsFile.content}</script>`;
      });

      iframeDocument.open();
      iframeDocument.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${currentFile}</title>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `);
      iframeDocument.close();
    }
  };

  // Effect to render content when currentFile or files change
  useEffect(() => {
    renderContent();
  }, [currentFile, files]);

  // Effect to handle navigation events within the iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const iframeWindow = iframe.contentWindow;

    const handleNavigation = (event) => {
      if (event.target.tagName === 'A') {
        event.preventDefault();
        const link = event.target.getAttribute('href');
        if (files.find((file) => file.name === link)) {
          setCurrentFile(link);
        }
      }
    };

    const handlePopState = () => {
      const newUrl = iframeWindow.location.pathname.substring(1);
      if (files.find((file) => file.name === newUrl)) {
        setCurrentFile(newUrl);
      }
    };

    const handleHashChange = () => {
      const hash = iframeWindow.location.hash.substring(1);
      if (files.find((file) => file.name === hash)) {
        setCurrentFile(hash);
      }
    };

    // Add event listeners
    iframeDocument.addEventListener('click', handleNavigation);
    iframeWindow.addEventListener('popstate', handlePopState);
    iframeWindow.addEventListener('hashchange', handleHashChange);

    // Cleanup event listeners on component unmount
    return () => {
      iframeDocument.removeEventListener('click', handleNavigation);
      iframeWindow.removeEventListener('popstate', handlePopState);
      iframeWindow.removeEventListener('hashchange', handleHashChange);
    };
  }, [files, currentFile, setCurrentFile]);

  return (
    <iframe
      ref={iframeRef}
      style={{ width: '100%', height: '100%', border: '2px solid black', margin: '10px' }}
      title="Live Preview"
    />
  );
}

export default LivePreview;
