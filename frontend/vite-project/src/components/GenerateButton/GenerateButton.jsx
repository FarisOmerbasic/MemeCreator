import React from 'react'
import './GenerateButton.css'
import { useAuth0 } from '@auth0/auth0-react'
import downloadBlob from '../../service/downloadBlob';

export default function GenerateButton({onClick, disabled, formData}) {
  const { getAccessTokenSilently, loginWithRedirect, isAuthenticated } = useAuth0();

  const handleClick = async (e) => {
    if (onClick) {
      return onClick(e);
    }
    if (!isAuthenticated) {
      await loginWithRedirect();
      return;
    }
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE }
      })

      const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
      const response = await fetch(`${apiBase}/api/meme/generate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!response.ok) {
        alert("Generate has failed")
        return;
      }
      const blob = await response.blob();
      const uploaded = formData.get('image');
      const filename = (uploaded && uploaded.name || "meme.png")
      downloadBlob(blob, filename);
    } catch (error) {
      console.error(error);
      alert("Error generating meme")
    }
  }

  return (
    <button className="btn-generate" onClick={handleClick} disabled={disabled}>
      Generate & Download
    </button>
  )
}
