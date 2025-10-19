const express = require('express');
const router = express.Router();
const multer = require('multer');
const imageService = require('../services/imageService');

const upload = multer({storage: multer.memoryStorage()}).fields([
    {name: 'image', maxCount: 1},
    {name: 'watermarkImage', maxCount: 1}
])

    const memeRequestHandler = (isPreview) => async (req, res) => {
    if (!req.files || !req.files.image || !req.files.image[0]) {
        return res.status(400).json({ error: 'Main image is required'})
    }
    try {
        const params = {...req.body} ;
    

        if (req.files.watermarkImage && req.files.watermarkImage[0]) {
            const wmFile = req.files.watermarkImage[0];
            params.watermarkImage = `data:${wmFile.mimetype};base64,${wmFile.buffer.toString('base64')}`;
        } 
        const mainImageBuffer = req.files.image[0].buffer;

        const serviceFunction = isPreview ? imageService.Preview : imageService.Generate;
        const imageBuffer = await serviceFunction(mainImageBuffer, params);

        res.set('Content-Type', 'image/png');
        res.send(imageBuffer);
    } catch (error) {
        console.error(`Error in memeRequest (isPreview=${isPreview}):`, error);
        res.status(500).json({ error: 'Internal error happened when generating image'});
        
    }
    }
    router.post('/meme/preview', upload, memeRequestHandler(true));
    router.post('/meme/generate', upload, memeRequestHandler(false));

    module.exports = router
