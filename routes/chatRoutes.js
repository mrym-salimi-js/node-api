const express = require('express');
const chatController = require('../controllers/chatController');
const userController = require('../controllers/userController');
const router = express.Router();

router.route('/sendMessage').post(chatController.chatMessage);
router
  .route('/chatMessages/:adId')
  .get(userController.protect, chatController.getChatMessages);
router
  .route('/chatContacts')
  .get(userController.protect, chatController.getContactsList);
module.exports = router;
