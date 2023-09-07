import React, { useEffect, useState, useRef } from "react";

const CodeBlock = ({ htmlCode, cssCode, jsCode }) => {
  const [showOutput, setShowOutput] = useState(false);
  const iframeRef = useRef(null);

  const executeCode = () => {
    const iframeDoc = iframeRef.current.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
      <style>${cssCode}</style>
      ${htmlCode}
      <script>${jsCode}</script>
    `);
    iframeDoc.close();
  };

  useEffect(() => {
    if (showOutput && iframeRef.current) {
      executeCode();
    }
  }, [htmlCode, cssCode, jsCode, showOutput]);

  return (
    <div>
      <button onClick={() => setShowOutput(!showOutput)}>
        {showOutput ? "Show Code" : "Show Output"}
      </button>
      {showOutput ? (
        <iframe
          ref={iframeRef}
          title="output"
          width="100%"
          height="500px"
        ></iframe>
      ) : (
        <div className="code-container">
          <div style={{ overflow: "auto", maxHeight: "500px" }}>
            {/* Add overflow: auto and maxHeight */}
            <h3>HTML</h3>
            <pre>{htmlCode}</pre>
            <h3>CSS</h3>
            <pre>{cssCode}</pre>
            <h3>JS</h3>
            <pre>{jsCode}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
