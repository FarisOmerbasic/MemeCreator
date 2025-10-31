import { useRef } from 'react';
import './WatermarkUpload.css';

export default function WatermarkUpload({config, setConfig}) {
  const inputRef = useRef();

   function handleChooseFile() {
    inputRef.current?.click();
  }

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => setConfig({...config, watermarkImage: reader.result, watermarkImageFile: file});
    reader.readAsDataURL(file);
  }
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setConfig({...config, watermarkImage: reader.result, watermarkImageFile: file})
    reader.readAsDataURL(file);
  };
  function handlePositionChange(event) {
    setConfig({...config, watermarkPosition: event.target.value});
  }
  function clearWatermark() {
    const copy = {...config};
    delete copy.watermarkImage;
    delete copy.watermarkPosition;
    delete copy.watermarkImageFile;
    setConfig(copy);
  }

  return (
    <div className="watermark-upload" onDrop={handleDrop} onDragOver={(event) =>
     event.preventDefault()}>
      <h3 className="watermark-title">Watermark (optional)</h3>
       <input
          ref={inputRef} type="file" accept="image/png, image/jpeg"
           onChange={handleFile}/>
      <div 
        className="watermark-zone" onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}>
        <div className="watermark-text">
          Drag & drop image here<br/>
          <button type="button" onClick={handleChooseFile} className="watermark-btn">Choose file</button>
        </div>
        <div className="controls">
          <select value={config?.watermarkPosition || 'bottom-right'} onChange={handlePositionChange}
           className="controls-pos">
            <option value={"bottom-right"}>Bottom Right</option>
            <option value={"bottom-left"}>Bottom Left</option>
            <option value={"top-right"}>Top Right</option>
            <option value={"top-left"}>Top Left</option>
          </select>
          <button className="delete" onClick={clearWatermark}>Remove</button>
        </div>
      </div>
    </div>
  );
  }