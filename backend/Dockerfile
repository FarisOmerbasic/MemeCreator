FROM node:18-bullseye-slim
WORKDIR /app
RUN apt-get update && \
    apt-get install -y --no-install-recommends fontconfig fonts-dejavu-core && \
    rm -rf /var/lib/apt/lists/*
COPY fonts/ /usr/share/fonts/truetype/custom/
RUN chown -R root:root /usr/share/fonts/truetype/custom && \
    chmod -R 644 /usr/share/fonts/truetype/custom/*.ttf || true && \
    fc-cache -f -v /usr/share/fonts/truetype/custom || true
COPY package*.json ./
RUN npm ci --production
COPY . .
ENV PORT=5000
EXPOSE 5000
CMD ["node", "src/server.js"]