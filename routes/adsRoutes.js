const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');

router.route('/').get(adController.getAllAd).post(adController.createAd);

module.exports = router;
