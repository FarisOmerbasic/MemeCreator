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


## Local development
Backend
cd backend
npm run dev

Frontend
cd frontend/vite-project
npm run dev

## Run with Docker
Docker-compose file is provided that is docker-compose.yaml
docker compose up -d --build (Create .env files before running)
To stop and remove type docker compose down

## How was deployment done

1) Authenticate Docker to GCR
```powershell
gcloud auth configure-docker
```

2) Build frontend image 
```powershell
- Must provide Vite build args so frontend uses correct API and Auth0 values:
docker build --build-arg VITE_API_BASE="" --build-arg VITE_AUTH0_DOMAIN="" --build-arg VITE_AUTH0_CLIENT_ID="" --build-arg VITE_AUTH0_AUDIENCE="" -t gcr.io/pristine-ally-471609-e1/meme-frontend:latest -f frontend/Dockerfile frontend
```

3) Push frontend image
```powershell
docker push gcr.io/pristine-ally-471609-e1/meme-frontend:latest
```

4) Deploy frontend to Cloud Run
```powershell
gcloud run deploy memecreator-frontend --image gcr.io/pristine-ally-471609-e1/meme-frontend:latest --region=europe-west8 --platform=managed --allow-unauthenticated
```

5) Build & push backend 
```powershell
docker build -t gcr.io/pristine-ally-471609-e1/meme-backend:latest -f backend/Dockerfile backend
docker push gcr.io/pristine-ally-471609-e1/meme-backend:latest
```

6) Deploy backend to Cloud Run
```powershell
gcloud run deploy memecreator-backend --image gcr.io/pristine-ally-471609-e1/meme-backend:latest --region=europe-west8 --platform=managed --allow-unauthenticated
```

7) After successful deploy you will see service URLs in the CLI output

