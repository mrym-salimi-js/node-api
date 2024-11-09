const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.route('/register').get(userController.register);
router.route('/login').get(userController.login);
router
  .route('/myAccount')
  .get(userController.protect, userController.getMyAccount);

module.exports = router;
