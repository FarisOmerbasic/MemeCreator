# MemeCreator
MemeCreator is a full-stack application that allows users to upload an image, add watermarks and text and then generate and download a finalized meme image. This repo contains Nodejs for backend and Vite + React for frontend

## Features
  Upload images (PNG/JPG)
  Add customizable top and bottom text with strokes
  Apply custom fonts, colors, and text styling
  Add optional watermarks with position control
  Live previews
  Download high-quality full-size meme images
  Dockerized backend and frontend 

  ### How it works
Login & Logout button for authentication
Drag & drop image upload
Live preview with debounced updates
Text customization (top/bottom captions)
Typography controls (font family, size, color)
Stroke customization (color, width)
Text alignment (left, center, right)
ALL-CAPS toggle
Watermark upload with position selector
One-click meme generation and download

### Backend
**Framework:** Express.js
**Image Processing:** Sharp
**File Upload:** Multer
**Containerization:** Docker

### Frontend
**Library:** React
**Build Tool:** Vite
**HTTP Client:** Fetch API
 **Styling:** CSS3

 ## Download behavior 
The frontend uses `service/downloadBlob.js` to trigger browser download.
The simple GenerateButton sends formData, receives a blob and calls `downloadBlob(blob,filename)`; filename is derived from the uploaded image or server headers.

## DDocker
To run contrainers using docker-compose run this command docker compose up -d --build