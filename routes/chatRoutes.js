const express = require('express');
const chatController = require('../controllers/chatController');
const router = express.Router();

router.route('/sendMessage').post(chatController.chatMessage);
router.route('/ChatMessages/:id').get(chatController.getChatMessages);
module.exports = router;
