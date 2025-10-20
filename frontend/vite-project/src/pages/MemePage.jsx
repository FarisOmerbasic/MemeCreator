import React, {useState} from "react";
import Upload from "../components/Uploads/Upload";
import "./MemePage.css";
import WatermarkUpload from "../components/Watermark/WatermarkUpload";

export default function MemePage() {
    const [file, setFile] = useState(null);
    const [config, setConfig] = useState({
        topText: "",
        bottomText: "",
        fontFamily: "Impact",
        fontSize: 48,
        textColor: "#ffffff",
        strokeColor: "#000000",
        strokewidth: 4,
        textAlign: "center",
        allCaps: false,
        padding: 24,
        watermarkImage: null,
        watermarkPosition: "bottom-right"
    })

    return (

        <div className="meme-main">
            <h1 className="meme-title">Meme Creator</h1>
            <div className="meme-content">
                <div className="meme-content">
                    <div className="meme-controls-col">
                        <Upload onSelect={setFile}/>
                        {file && <p>Selected: {file.name}</p>}
                        <WatermarkUpload config={config} setConfig={setConfig}/>
                        </div>
                    </div>
                </div>
            </div>
    );
}