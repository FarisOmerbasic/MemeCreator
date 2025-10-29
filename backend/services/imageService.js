const sharp = require('sharp');
const overlayService = require('./overlayService');

function getWatermarkPosition(watermarkBuffer, position){
  const positions = {
   'top-left': { gravity: 'northwest' },
   'top-right': { gravity: 'northeast' },
   'bottom-left': { gravity: 'southwest' },
    'bottom-right': { gravity: 'southeast' },
    'center': { gravity: 'center' }
  };
  const positionConfig = positions[position] || positions['bottom-right'];
  return {input: watermarkBuffer, blend: 'over', gravity: positionConfig.gravity}
}

async function preview(imageBuffer, params = {}) {
  const scale = Math.max(0.01, Math.min(0.25, Number(params.scaleDown || params.scale) || 0.05));
  const dpr = Math.max(1, Math.floor(Number(params.dpr) || 1));
  const image = sharp(imageBuffer);
  const { width, height, format: originalFormat } = await image.metadata();
  const previewWidth = Math.round(width * scale);
  const previewHeight = Math.round(height * scale);
  const outWidth = previewWidth * dpr;
  const outHeight = previewHeight * dpr;
  const overlay = overlayService.buildOverlay(outWidth, outHeight, params);

  const compositeLayers = [{input: overlay, blend: 'over'}];
  if (params.watermarkImageBuffer) {
    const watermarkLayer = getWatermarkPosition(params.watermarkImageBuffer, params.watermarkPosition);
    compositeLayers.push(watermarkLayer);
  }

  const outputFormat = (params.outputFormat || originalFormat || 'png').toLowerCase();
  const formatMethod = outputFormat === 'jpg' || outputFormat === 'jpeg' ? 'jpeg' : outputFormat;
  const outBuffer = await sharp(imageBuffer)
    .resize(outWidth, outHeight)
    .composite(compositeLayers)
    [formatMethod]({ quality: 90 })
    .toBuffer();

  return { buffer: outBuffer, width: previewWidth, height: previewHeight };
}

async function generate(imageBuffer, params = {}) {
  const image = sharp(imageBuffer);
  const { width, height, format: originalFormat } = await image.metadata();
  const overlay = overlayService.buildOverlay(width, height, params);

  const compositeLayers = [{input: overlay, blend: 'over'}];
  if (params.watermarkImageBuffer) {
    const watermarkLayer = getWatermarkPosition(params.watermarkImageBuffer, params.watermarkPosition);
    compositeLayers.push(watermarkLayer);
  }

  const outputFormat = (params.outputFormat || originalFormat || 'png').toLowerCase();
  const formatMethod = outputFormat === 'jpg' || outputFormat === 'jpeg' ? 'jpeg' : outputFormat;
  return sharp(imageBuffer)
    .composite(compositeLayers)
    [format === 'jpg' ? 'jpeg' : format]({ quality: 90 }) 
    .toBuffer();
}

module.exports = { preview, generate };
