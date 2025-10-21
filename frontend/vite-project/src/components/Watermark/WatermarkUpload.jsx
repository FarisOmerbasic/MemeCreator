import React, { useRef } from 'react';
import './WatermarkUpload.css';

export default function WatermarkUpload({config, setConfig}) {
  const inputRef = useRef();

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if(!file) {
      setConfig({...config, watermarkImage: null});
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setConfig({...config, watermarkImage: reader.result});
    reader.readAsDataURL(file);
  }
  const handleDrop = (event) => {
    event.preventDefault();
    handleFile({target: {files: event.dataTransfer.files}})
  };

  return (
    <div className="watermark-upload">
      <h3 className="watermark-title">Watermark (optional)</h3>
      <div 
        className="watermark-zone" onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}>
        <input
          ref={inputRef} type="file" accept="image/png, image/jpeg"
          style={{display:'none'}} onChange={handleFile}/>
        <div className="watermark-text">
          Drag & drop image here<br/>
          <button className="watermark-btn">Choose file</button>
        </div>
      </div>
    </div>
  );
  }