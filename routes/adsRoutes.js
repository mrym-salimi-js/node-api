const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req);
    cb(null, `public/photos/`);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage });
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
