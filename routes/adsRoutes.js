const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');

router.route('/').get(adController.getAllAd).post(adController.createAd);
router
  .route('/:id')
  .get(adController.getAd)
  .delete(adController.deleteAd)
  .patch(adController.updateAd);

router.route('/s/:category').get(adController.getAdsByCategory);

// router.route('/filter').get(adController.getAdsByFilter);

module.exports = router;
