const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const multer = require('multer');

// ذخیره فایل‌ها در حافظه (نه روی دیسک)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router
  .route('/')
  .get(adController.getAllAd)
  .post(upload.array('photoFile', 10), adController.createAd);

router
  .route('/:id')
  .get(adController.getAd)
  .delete(adController.deleteAd)
  .patch(adController.updateAd);

router.route('/s/:category').get(adController.getAdsByCategory);

module.exports = router;
