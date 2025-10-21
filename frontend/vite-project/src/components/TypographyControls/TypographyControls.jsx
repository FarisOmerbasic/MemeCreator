import React from 'react'
import './TypographyControls.css'

export default function TypographyControls({config,setConfig}) {
    const u = (k, v) => setConfig({...config, [k]: v})
    
    return ( 
        <div className="typography-section">
            <h3 className="section-title">Typography</h3>
            <div className="typography-controls">
             <div className="control-row">
                <div className="input-group">
                    <label>Font Family</label>
                    <select value={config.fontFamily} onChange={e => u("fontFamily", e.target.value)}>
                      <option value="Impact">Impact</option>
                      <option value="Arial Black">Arial Black</option>
                      <option value="Arial">Arial</option>
                    </select>
                    </div>
                    <div className="input-group">
                        <label>Font Size</label>
                    <div className="slider-group">
                        <input
                            type="range" min="8" max="128" step="1"
                            value={config.fontSize}
                            onChange={e => u("fontSize", + e.target.value)}/>
                            <span className="value">{config.fontSize}px</span>
                    </div>
                </div>
            </div>

                <div className="control-row">
                    <div className="input-group">
                        <label>Text Color</label>
                        <input
                            type="color"
                            value={config.textColor}
                            onChange={e => u("textColor", e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label>Stroke Color</label>
                        <input
                            type="color" value={config.strokeColor}
                            onChange={e => u("strokeColor", e.target.value)}/>
                    </div>
                    <div className="input-group">
                        <label>Stroke Width</label>
                        <div className="slider-group">
                        <input 
                            type="range" min="0" max="20" step="1"
                            value={config.strokeWidth}
                            onChange={e => u("strokeWidth", +e.target.value)}/>
                            <span className="value">{config.strokeWidth}px</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}