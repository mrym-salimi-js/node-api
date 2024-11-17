const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const multer = require('multer');
const fs = require('fs-extra');

// Upload Photo
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // const fName = file.originalname.split('.')[0];
    // const tempPath = `public/temp/${file.originalname}`;
    // await fs.ensureDir(tempPath);
    cb(null, 'public/temp');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
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
