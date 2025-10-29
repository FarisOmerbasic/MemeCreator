import './AlignmentControls.css'

export default function AlignmentControls({config,setConfig}) {
    return (
        <div className="alignment-section">
         <div className="alignment-controls">
          <div className="control-row">
             <div className="checkbox-group">
                <label className="checkbox-label">
                 <input
                 type="checkbox" checked={config.allCaps}
                 onChange={e => setConfig({...config, allCaps: e.target.checked})}/>
                 <span className="checkbox-text">ALL-CAPS</span>
                       </label>
                    </div>
                </div>
                
                <div className="control-row">
                <label className="alignment-title">Text Alignment</label>
                  <div className="radio-group">
                    {["Left", "Center", "Right"].map(align => (
                         <label key={align.toLowerCase()} className="radio-label">
                                <input 
                                    type="radio" name="align" 
                                    value={align.toLowerCase()} checked={config.textAlign === align.toLowerCase()}
                                    onChange={() => setConfig({...config, textAlign: align.toLowerCase()})} 
                                />
                                <span>{align}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}