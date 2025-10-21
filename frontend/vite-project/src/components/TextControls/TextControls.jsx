import React from "react";
import './TextControls.css'
export default function TextControls({config, setConfig}) {
    return (
        <div className="text-section">
            <h3 className="section-title">Text</h3>
            <div className="text-inputs">
                <div className="input-group">
            <label>Top Text</label>
            <input
            type="text" value={config.topText}
            onChange={e => setConfig({...config, topText: e.target.value})}
            placeholder="Enter top text" className="text-input"/>
            </div>
            <div className="input-group">
            <label>Bottom Text</label>
            <input 
            type="text" value={config.bottomText}
            onChange={e => setConfig({...config, bottomText: e.target.value})}
            placeholder="Enter bottom text" className="text-input"/>
            </div>
        </div>
    </div>
    )
}