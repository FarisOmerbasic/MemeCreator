const sharp = require('sharp')

function buildOverlay(width, height, params) {
    const {
    topText = '',
    bottomText = '',
    fontfamily = 'Impact',
    fontSize = 64,
    textColor = 'FFFFFF',
    strokeColor = '#000000',
    strokeWidth = 3,
    textAlign,
    padding = 20,
    allCaps = true,
    watermarkImage,
    watermarkPosition = 'bottom-right'
    } = params

    const finalTopText = allCaps ? topText.toUpperCase() : topText;
    const finalBottomText = allCaps ? bottomText.toUpperCase() : bottomText;

    const allowedAlignments = ['left', 'center', 'right',]
    const finalAlign = allowedAlignments.includes(textAlign) ? textAlign: 'center';

    


}