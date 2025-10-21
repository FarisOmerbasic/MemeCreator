import './SourceImage.css'

export default function SourceImage({file}) {
    return ( 
        <div className="source-image">
            <span className="section-label">Source Image</span>
            {file ? (<img src={URL.createObjectURL(file)} alt="source" className="source" />): (
                <div className="source-placeholder">No image</div>
            )}
        </div>
    )
}