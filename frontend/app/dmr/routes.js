
const express = require('express');
const sensorDataController = require('./service.js');

const router = express.Router();

router.get("/dmrData", sensorDataController.dmrData);
router.post("/triggerSetting",sensorDataController.triggerSetting);
router.get("/getTriggerSetting", sensorDataController.getTriggerSetting);
router.get("/getHelpDesk", sensorDataController.getHelpDesk);
router.get("/pocHelix", sensorDataController.pocHelix);

module.exports = router;
