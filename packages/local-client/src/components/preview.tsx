import { useEffect, useRef } from 'react';
import './preview.css';

interface PreviewProps {
  code: string;
  bundlingStatus: string;
}

// listen from parent document. to emit message down into iframe. 
// this prevents html 
const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
        const handleError = (err) => {
          const root = document.querySelector('#root');
          root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
          console.error(err);
        };
        window.addEventListener('error', (event) => {
          event.preventDefault();
          handleError(event.error);
        })
        window.addEventListener('message', (event) => {
          try{
              eval(event.data);
          } catch (err) {
            handleError(err);
          }
        }, false);
        </script>
      </body>
    </html>
    `;

// "code" replaces result.outputFiles[0].text
const Preview: React.FC<PreviewProps> = ({ code, bundlingStatus }) => {
  const iframe = useRef<any>();
  useEffect(() => {
    iframe.current.srcdoc = html;
    // post a message to iframe element 
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);


  return (
    <div className="iframe-wrapper">
      <iframe
        title="iframe"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {bundlingStatus && <div className="preview-error">{bundlingStatus}</div>}

    </div>
  );
};

export default Preview;