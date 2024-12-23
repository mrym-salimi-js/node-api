const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

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
