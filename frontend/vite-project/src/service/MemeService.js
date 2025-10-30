const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export async function previewMeme(file, config) {
  const fd = new FormData();
  if (file) fd.append("image", file);
  fd.append("config", JSON.stringify(config || {}));
  if (config?.watermarkImageFile) fd.append("watermarkImage", config.watermarkImageFile);

  const res = await fetch(`${API_BASE}/api/meme/preview`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error("preview failed");
  return await res.json();
}

export async function generateMeme(formData) {
  const res = await fetch(`${API_BASE}/api/meme/generate`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("generate failed");
  const blob = await res.blob();
  return blob;
}

export default {
  previewMeme,
  generateMeme,
};