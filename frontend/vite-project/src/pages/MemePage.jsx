import React, {useState, useEffect} from "react";
import Upload from "../components/Uploads/Upload";
import "./MemePage.css";
import WatermarkUpload from "../components/Watermark/WatermarkUpload";
import SourceImage from "../components/Source/SourceImage";
import Preview from "../components/Preview/Preview";
import {previewMeme} from "../service/MemeService"

export default function MemePage() {
    const [file, setFile] = useState(null);
    const [config, setConfig] = useState({
        topText: "",
        bottomText: "",
        fontFamily: "Impact",
        fontSize: 48,
        textColor: "#ffffff",
        strokeColor: "#000000",
        strokeWidth: 4,
        textAlign: "center",
        allCaps: false,
        padding: 24,
        scaleDown: 0.25,
        watermarkImage: null,
        watermarkPosition: "bottom-right"
    })
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loadingPreview, setLoadingPreview] = useState(false);

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            return;
        }
        setLoadingPreview(true);
        const id = setTimeout(async () => {
            try {
                const url = await previewMeme(file, config);
                setPreviewUrl(url);
            } catch {
                setPreviewUrl(null)
            } finally {
                setLoadingPreview(false);
            }
        }, 300);
        return () => clearTimeout(id);
    }, [file, JSON.stringify(config)])

    return (

        <div className="meme-main">
            <h1 className="meme-title">Meme Creator</h1>
                <div className="meme-content">
                    <div className="meme-controls-col">
                        <Upload onSelect={setFile}/>
                        {file && <p>Selected: {file.name}</p>}
                        <WatermarkUpload config={config} setConfig={setConfig}/>
                        </div>
                        <div className="meme-preview-col">
                            <SourceImage file={file}/>
                            <Preview url={previewUrl} loading={loadingPreview} watermarkFile={config.watermarkImage}/>
                        </div>
                    </div>
                </div>
    );
}