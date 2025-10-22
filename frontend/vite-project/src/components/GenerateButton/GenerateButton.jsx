import React from 'react'
import './GenerateButton.css'
export default function GenerateButton({onClick, disabled}) {
  return (
    <button className="btn-generate" onClick={onClick} disabled={disabled}>
        Generate & Download
    </button>
  )
}
