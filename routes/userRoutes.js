const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');

// ذخیره فایل‌ها در حافظه (نه روی دیسک)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route('/register').post(userController.register);
router.route('/login').post(userController.login);
router.route('/logout').get(userController.protect, userController.logout);
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

router
  .route('/user/:userId')
  .get(userController.protect, userController.getUserById);
router
  .route('/checkAuth')
  .get(userController.protect, userController.ckeckAuth);
router
  .route('/myAds')
  .get(userController.protect, userController.getAdsByCreator);
router
  .route('/saved/:adId')
  .patch(userController.protect, userController.updateSavedAds);
router
  .route('/savedAds')
  .get(userController.protect, userController.getSavedAds);
router
  .route('/status')
  .get(userController.protect, userController.updateUserStatus);

module.exports = router;
