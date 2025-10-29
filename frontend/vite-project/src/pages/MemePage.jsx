import React, {useState, useEffect} from "react";
import Upload from "../components/Uploads/Upload";
import "./MemePage.css";
import WatermarkUpload from "../components/Watermark/WatermarkUpload";
import SourceImage from "../components/Source/SourceImage";
import Preview from "../components/Preview/Preview";
import {previewMeme} from "../service/MemeService"
import TextControls from "../components/TextControls/TextControls";
import TypographyControls from "../components/TypographyControls/TypographyControls";
import AlignmentControls from "../components/AlignmentControls/AlignmentControls";
import GenerateButton from "../components/GenerateButton/GenerateButton";
import Header from "../components/Authentication/Header";

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
    const [previewSize, setPreviewSize] = useState({width: null, height: null})

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            return;
        }
        setLoadingPreview(true);
        const id = setTimeout(async () => {
            try {
                  const result = await previewMeme(file,config);
                setPreviewUrl(result.url);
                setPreviewSize({width: result.width, height: result.height});
            } catch {
                setPreviewUrl(null)
                setPreviewSize({width: null, height: null});
            } finally {
                setLoadingPreview(false);
            }
        }, 300);
        return () => clearTimeout(id);
    }, [file, JSON.stringify(config)])

    const buildFormData = () => {
        const fd = new FormData();
        fd.append('config', JSON.stringify(config));
        if (file) fd.append('image', file)
        return fd;
    }

    return (

        <div className="meme-main">
            <Header />
            <h1 className="meme-title">Meme Creator</h1>
                <div className="meme-content">
                    <div className="meme-controls-col">
                        <Upload onSelect={setFile}/>
                        <WatermarkUpload config={config} setConfig={setConfig}/>
                        <TextControls config={config} setConfig={setConfig}/>
                        <TypographyControls config={config} setConfig={setConfig}/>
                        <AlignmentControls config={config} setConfig={setConfig}/>
                        </div>
                        <div className="meme-preview-col">
                            <div>
                                <span className="section">Source Image</span>
                                <SourceImage file={file}/>
                            </div>
                            <div>
                                <span className="section">Live Preview</span>
                           <Preview
                           url={previewUrl} loading={loadingPreview}
                           watermarkFile={config.watermarkImage} config={config}
                           width={previewSize.width} height={previewSize.height}/>
                            </div>
                            <div className="meme-action">
                                <GenerateButton formData={buildFormData()} disabled={!file}/>
                            </div>
                        </div>
                    </div>
                </div>
    );
}