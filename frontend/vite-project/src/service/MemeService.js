const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export async function previewMeme(file, config) {
    const form = new FormData();
    form.append("image", file);
    form.append("config", JSON.stringify(config));

    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    const res = await fetch(`${API_BASE}/api/meme/preview?dpr=${dpr}`, {
        method: "POST",
        body: form,
    });

    if (!res.ok) {
        throw new Error("Preview failed")
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    
    const w = Number(res.headers.get('Preview-Width')) || null;
    const h = Number(res.headers.get('Preview-Height')) || null;
    return {url, width: w, height: h }
}


export async function generateMeme(file, config) {
    const form = new FormData();
    form.append("image", file);
    form.append("config", JSON.stringify(config));

    const res = await fetch(`${API_BASE}/api/meme/generate`, {
        method: "POST",
        body: form,
    });

    if (!res.ok) {
        throw new Error("Generate failed");
    }
    const blob = await res.blob();
    return blob;
}