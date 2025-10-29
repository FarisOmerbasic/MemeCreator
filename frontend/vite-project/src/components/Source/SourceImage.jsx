import '../Shared/SharedSourcePreview.css'
export default function SourceImage({file}) {
    return ( 
        <div className="image-fit-container">
            {file ? (<img src={URL.createObjectURL(file)} alt="source" className="image-fit" />): (
                <div className="source-placeholder">No image</div>
            )}
        </div>
    )
}