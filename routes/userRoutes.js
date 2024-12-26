const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // const fName = file.originalname.split('.')[0];
    // const tempPath = `public/temp/${file.originalname}`;
    // await fs.ensureDir(tempPath);
    cb(null, 'public/user/temp');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage });

router.route('/register').post(userController.register);
router.route('/login').post(userController.login);
router.route('/me').get(userController.protect, userController.getMe);
router
  .route('/adminAccount')
  .get(
    userController.protect,
    userController.restrictTo('admin'),
    userController.getAdminAccount,
  );
router.route('/forgetPassword').post(userController.forgetPassword);
router.route('/resetPassword/:token').post(userController.resetPassword);
router
  .route('/updateMyPassword')
  .patch(userController.protect, userController.updateMyPassword);
router
  .route('/updateMe')
  .patch(userController.protect, userController.updateMe);
router
  .route('/updatePhoto')
  .patch(
    upload.single('photo'),
    userController.protect,
    userController.updatePhoto,
  );
router
  .route('/deleteMe')
  .delete(userController.protect, userController.deleteMe);

// router.route('/:id').get(userController.getUser);
router
  .route('/checkAuth')
  .get(userController.protect, userController.ckeckAuth);
router
  .route('/myAds')
  .get(userController.protect, userController.getAdsByCreator);
router
  .route('/saved/:adId')
  .get(userController.protect, userController.updateSavedAds);

module.exports = router;
