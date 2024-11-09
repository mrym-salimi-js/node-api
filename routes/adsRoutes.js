const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const multer = require('multer');

// Upload Photo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `public/photos`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
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

// router.route('/filter').get(adController.getAdsByFilter);

module.exports = router;
