const express = require("express");

const { getWeather } = require("../controllers/weather-controller");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// router.use(checkAuth);

router.get("/:city", getWeather);

module.exports = router;
