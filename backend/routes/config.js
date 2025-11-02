const express = require("express");
const router = express.Router();
const configController = require("../controllers/configController");

router.post("/config", configController.createConfig);
router.put("/config/:id", configController.updateConfig);

module.exports = router;
