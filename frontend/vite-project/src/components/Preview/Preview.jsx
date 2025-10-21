
export default function MemePreview({url, loading, watermarkFile}){
    return (
        <div className="live-preview">
            <span className="section">Live Preview</span>
            {loading ? (
                <div className="no-preview">Loading preview...</div>):url ? (
                    <img src={url} alt="preview" className="preview-img"/>):(
                        <div className="no-preview">Preview will appear here</div>
            )}
            {watermarkFile && <span className="watermark-indicator">Watermark applied</span>}
        </div>
    )
}