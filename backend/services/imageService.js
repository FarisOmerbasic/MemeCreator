const sharp = require('sharp');
const overlayService = require('./overlayService');

async function preview(imageBuffer, params = {}) {
    const requested = typeof params.scaleDown !== 'undefined' ? params.scaleDown : params.scaledown
    const scale = Math.max(0.01, Math.min(0.25, Number(requested) || 0.05))
    const dpr = Math.max(1, Math.floor(Number(params.dpr) || 1))
    const image = sharp(imageBuffer)
    const metadata = await image.metadata();
    const {width,height} = metadata;
    const previewWidth = Math.max(1, Math.round(width * scale));
    const previewHeight = Math.max(1, Math.round(height * scale));
    const outWidth = previewWidth * dpr;
    const outHeight = previewHeight * dpr;
    const scaledParamsForOverlay = overlayService.scaleOverlayParams(params, scale * dpr)
    const overlay = overlayService.buildOverlay(outWidth, outHeight, scaledParamsForOverlay);

    const outBuffer = await sharp(imageBuffer)
     .resize(outWidth, outHeight)
     .composite([{input: overlay, blend: 'over'}])
     .png()
     .toBuffer();
     return {buffer: outBuffer, width: previewWidth, height: previewHeight}
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