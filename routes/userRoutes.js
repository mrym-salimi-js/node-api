const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.route('/register').get(userController.register);
router.route('/login').get(userController.login);
router
  .route('/myAccount')
  .get(userController.protect, userController.getMyAccount);
router
  .route('/adminAccount')
  .get(
    userController.protect,
    userController.restrictTo('admin'),
    userController.getAdminAccount,
  );
router.route('/forgetPassword').post(userController.forgetPassword);
router.route('/resetPassword').post(userController.resetPassword);

module.exports = router;
