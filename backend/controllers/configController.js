const configService = require('../services/configService');

exports.createConfig = (req, res) => {
  const newConfig = configService.createConfig(req.body);
  res.status(201).json(newConfig);
};

exports.updateConfig = (req, res) => {
  const { id } = req.params;
  const updatedConfig = configService.updateConfig(id, req.body);
  if (updatedConfig) {
    res.json(updatedConfig);
  } else {
    res.status(404).json({ error: `${id} not found` });
  }
};