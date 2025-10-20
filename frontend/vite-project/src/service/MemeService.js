const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export async function previewMeme(file, config, watermarkFile = null) {
    const form = new FormData();
    form.append("image", file);
    if (watermarkFile) form.append("watermarkImage", watermarkFile)
    form.append("config", JSON.stringify(config));

    const res = await fetch(`${API_BASE}/api/meme/preview`, {
        method: "POST",
        body: form,
    });

    if (!res.ok) {
        throw new Error("Preview failed")
    }

    const blob = await res.blob();
    return URL.createObjectURL(blob);
}

export async function generateMeme(file, config, watermarkFile = null) {
    const form = new FormData();
    form.append("image", file);
    if (watermarkFile) form.append("watermarkImage", watermarkFile)
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