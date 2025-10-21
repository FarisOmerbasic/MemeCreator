import React from "react"
import '../Shared/SharedSourcePreview.css'
export default function MemePreview({url, loading, watermarkFile, width, height}){
    return (
        <div className="image-fit-container">
            {loading ? (
                <div className="no-preview">Loading preview...</div>):url ? (
                    <img src={url} alt="preview" className="image-fit" width={width || undefined} height={height || undefined}/>):(
                        <div className="no-preview">Preview will appear here</div>
            )}
            {watermarkFile && <span className="watermark-indicator">Watermark applied</span>}
        </div>
    )
}