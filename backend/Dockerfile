FROM node:18-bullseye-slim
WORKDIR /app
RUN apt-get update && \
    apt-get install -y --no-install-recommends fontconfig fonts-dejavu-core && \
    rm -rf /var/lib/apt/lists/*
COPY fonts/ /usr/share/fonts/truetype/custom/
RUN fc-cache -f -v || true
COPY package*.json ./
RUN npm ci --production
COPY . .
ENV PORT=8080
EXPOSE 8080
CMD ["node", "src/server.js"]