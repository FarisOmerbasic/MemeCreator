const sharp = require('sharp')

function buildOverlay(width, height, params) {
    const {
    topText = '',
    bottomText = '',
    fontFamily = 'Impact',
    fontSize = 64,
    textColor = '#FFFFFF',
    strokeColor = '#000000',
    strokeWidth = 3,
    textAlign,
    padding = 20,
    allCaps = true,
    watermarkImage,
    watermarkPosition = 'bottom-right',
    scaleDown = 0.25
    } = params

    const finalTopText = allCaps ? topText.toUpperCase() : topText;
    const finalBottomText = allCaps ? bottomText.toUpperCase() : bottomText;

    const enumAlignments = ['left', 'center', 'right',]
    const finalAlign = enumAlignments.includes(textAlign) ? textAlign: 'center';

   let x = width / 2;
   if(finalAlign === 'left') {
    x = padding;
   } else if (finalAlign === 'right') {
    x = width - padding
   }

   const svg = `
   <svg width="${width}" height="${height}">
   <style>
   .meme-text {
   font-family: "${fontFamily}";
   font-size: ${fontSize}px;
   fill: "${textColor}";
   stroke: "${strokeColor}";
   stroke-width: ${strokeWidth}px;
   text-anchor: "${finalAlign}";
   paint-order: stroke;
}
   </style>
   <text x="${x}" y="${padding + fontSize}" class="meme-text" dominant-baseline="hanging">${finalTopText}</text>
   <text x="${x}" y="${height - padding}" class="meme-text" dominant-baseline="auto">${finalBottomText}</text>
   </svg>`

   return Buffer.from(svg);
}

    async function Generate(imageBuffer, params) {
        const image = sharp(imageBuffer);
        const metadata = await image.metadata();
        const textOverlay = buildOverlay(metadata.width, metadata.height, params);
        const finalImageBuffer = await sharp(imageBuffer)
        .composite([{ input: textOverlay}])
        .png({quality: 90})
        .toBuffer();

        return finalImageBuffer;
    }
    module.exports = {
        Generate,
    };

