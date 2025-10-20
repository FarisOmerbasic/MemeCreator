import React, {useState} from "react";
import Upload from "../components/Uploads/Upload";
import "./MemePage.css";

export default function MemePage() {
    const [file, setFile] = useState(null);

    return (

        <div className="meme-main">
            <h1 className="meme-title">Meme Creator</h1>
            <div className="meme-content">
                <div className="meme-content">
                    <div className="meme-controls-col">
                        <Upload onSelect={setFile}/>
                        {file && <p>Selected: {file.name}</p>}
                        </div>
                    </div>
                </div>
            </div>
    );
}