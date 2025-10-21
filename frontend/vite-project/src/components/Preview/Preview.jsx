import React from "react"
import '../Shared/SharedSourcePreview.css'
export default function MemePreview({url, loading, watermarkFile, width, height}){
    return (
        <div className="image-fit-container">
            {loading ? (
                <div className="no-preview">Loading preview...</div>):url ? (
                   <div className="preview-wrapper"> <img src={url} alt="preview" className="image-fit" width={width || undefined} height={height || undefined}/>
                    {watermarkFile && (<span className="watermark-indicator">Watermark applied</span>)}</div>):(
                        <div className="no-preview">Preview will appear here</div>
            )}
         </div>
    )
}