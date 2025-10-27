const sharp = require('sharp');
const overlayService = require('./overlayService');

async function preview(imageBuffer, params = {}) {
  const scale = Math.max(0.01, Math.min(0.25, Number(params.scaleDown || params.scaledown) || 0.05));
  const dpr = Math.max(1, Math.floor(Number(params.dpr) || 1));
  const image = sharp(imageBuffer);
  const { width, height } = await image.metadata();
  const previewWidth = Math.round(width * scale);
  const previewHeight = Math.round(height * scale);
  const outWidth = previewWidth * dpr;
  const outHeight = previewHeight * dpr;
  const overlay = overlayService.buildOverlay(outWidth, outHeight, params);

  const format = (params.outputFormat || 'png').toLowerCase(); 
  const outBuffer = await sharp(imageBuffer)
    .resize(outWidth, outHeight)
    .composite([{ input: overlay, blend: 'over' }])
    [format]({ quality: 90 }) 
    .toBuffer();

  return { buffer: outBuffer, width: previewWidth, height: previewHeight };
}

async function generate(imageBuffer, params = {}) {
  const image = sharp(imageBuffer);
  const { width, height } = await image.metadata();
  const overlay = overlayService.buildOverlay(width, height, params);

  const format = (params.outputFormat || 'png').toLowerCase();
  return sharp(imageBuffer)
    .composite([{ input: overlay, blend: 'over' }])
    [format]({ quality: 90 })
    .toBuffer();
}

module.exports = { preview, generate };
