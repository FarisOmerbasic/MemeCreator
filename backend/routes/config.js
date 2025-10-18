const express = require('express');
const router = express.Router();
const configService = require('../services/configService')

router.post('/config', (req, res) => {
    const newConfig = configService.createConfig(req.body);
    res.status(201).json(newConfig);
})

router.put('/config/:id', (req, res) => {
    const {id} = req.params;
    const payload = req.body;
    const updatedConfig = configService.updateConfig(id, payload);
    if (updatedConfig) {
        res.json(updatedConfig)
    } else {
        res.status(404).json({error: `${id} not found`})
    }
})
module.exports = router;