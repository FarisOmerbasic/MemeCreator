const sharp = require('sharp');
const overlayService = require('./overlayService');

async function preview(imageBuffer, params = {}) {
    const scale = Math.max(0.01, Math.min(0.25, Number(params.scaledown) || 0.05));
    const image = sharp(imageBuffer);
    const {width, height} = await image.metadata();
    const newWidth = Math.round(width * scale)
    const newHeight = Math.round(height * scale);
    const scaledParams = overlayService.scaleOverlayParams(params, scale)
    const overlay = overlayService.buildOverlay(newWidth, newHeight, scaledParams);

    return await sharp(imageBuffer)
     .resize(newWidth, newHeight)
     .composite([{input: overlay, blend: 'over'}])
     .png()
     .toBuffer();
}

async function generate(imageBuffer, params = {}) {
 const image = sharp(imageBuffer)
const {width, height} = await image.metadata();
 const overlay = overlayService.buildOverlay(width, height, params);

 return sharp(imageBuffer)
  .composite([{input: overlay, blend: 'over'}])
  .png({quality: 90})
  .toBuffer();
}

module.exports = { preview, generate}