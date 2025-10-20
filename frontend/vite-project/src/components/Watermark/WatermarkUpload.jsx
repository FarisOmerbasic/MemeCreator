import React from "react";

export default function WatermarkUpload({config, setConfig }) {
function handleFile(e) {
    const file = e.target.files?.[0];
    if(!file) {
        setConfig({...config, watermarkImage: null});
        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
        setConfig({...config,watermarkImage: reader.result});
    };
    reader.readAsDataURL(file);
}
  return (
    <div className="watermark-upload">
        <label>Watermark (optional)</label>
        <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFile}
        />
        <span className="watermark-indicator">
        {config.watermarkImage ? "Watermark Applied" : ""}
        </span>
    </div>
  )
}