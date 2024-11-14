const socketIo = require('socket.io');
const app = require('../app');
const http = require('http');
const Chat = require('../models/chatModel');

exports.chatMessage = async (req, res, next) => {
  const server = http.createServer(app);

  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('sendMessage', async ({ senderId, reciverId, message }) => {
      const chat = new Chat({
        senderId: senderId,
        reciverId: reciverId,
        message: message,
      });
      await chat.save();
      io.to(recipientId).emit('receiveMessage', message);
    });
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

exports.getChatMessages = async (req, res, next) => {
  try {
    const messages = await Chat.find({
      $or: [{ senderId: req.params.id }, { reciverId: req.params.id }],
    });

    res.status(200).json({
      status: 'success',
      data: messages,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};
