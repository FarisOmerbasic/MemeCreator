import { useState, useRef } from "react"
import "./Upload.css";

export default function Upload({onSelect}) {
    const [preview, setPreview] = useState(null);
    const inputRef = useRef();

    function handleChange(e) {
        const file = e.target.files[0];
        onSelect(file);
        setPreview(file ? URL.createObjectURL(file) : null);
    }

    function handleDrop(e) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        onSelect(file);
        setPreview(file ? URL.createObjectURL(file) : null);
    }
    return (
     <div className="upload"
     onClick={() => inputRef.current.click()}
     onDrop={handleDrop}
     onDragOver={e => e.preventDefault()}
     >
     <input
     ref={inputRef}
     type="file"
     accept="image/png, image/jpeg"
     style={{display:"none"}}
     onChange={handleChange}/>
     <div className="upload-text">
        Drag & drop image here<br/>
        <span className="choose-file-btn">Choose file</span>
     </div>
     {preview && <img src={preview} alt="preview" className="upload-preview"></img>}
     </div>
    )
}