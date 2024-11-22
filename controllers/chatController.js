const socketIo = require('socket.io');
const app = require('../app');
const http = require('http');
const Chat = require('../models/chatModel');
const Ad = require('../models/adModel');
const User = require('../models/userModel');
const { ObjectId } = require('mongodb');

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

exports.getContactsList = async (req, res, next) => {
  try {
    const messagesByUserId = await Chat.find({
      $or: [{ senderId: req.user.id }, { reciverId: req.user.id }],
    });
    if (!messagesByUserId) return;

    const adIds = messagesByUserId?.map((ad) => ad.adId?.toString());
    if (!adIds) return;

    const myChat = await Chat.find({
      $or: [{ senderId: req.user.id }, { reciverId: req.user.id }],
      adId: { $in: [...new Set(adIds)] },
    });

    if (!myChat) return;

    let adInfoForChat;
    if (myChat[0].senderId.toString() === req.user.id) {
      const messagesByAdId = await Ad.find({
        _id: { $in: adIds },
      });
      if (!messagesByAdId) return;

      adInfoForChat = {
        adId: messagesByAdId[0]?.id,
        adName: messagesByAdId[0]?.title,
        photo: messagesByAdId[0]?.photo,
        createAd: messagesByAdId[0]?.createAd,
      };
    }

    if (myChat[0].reciverId.toString() === req.user.id) {
      const senderInfo = await User.find({
        _id: myChat[0].senderId.toString(),
      });

      adInfoForChat = {
        adId: senderInfo[0]?.id,
        adName: senderInfo[0]?.name,
        createAd: senderInfo[0]?.createAd,
        photo: [],
      };
    }

    res.status(200).json({
      status: 'success',
      resault: adInfoForChat.length,
      data: adInfoForChat,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getChatMessages = async (req, res, next) => {
  try {
    let data = {};

    const messages = await Chat.find({
      $or: [{ senderId: req.user.id }, { reciverId: req.user.id }],
      adId: req.params.adId,
    });

    if (!messages) return;
    data.message = messages;

    if (messages[0].reciverId.toString() === req.user.id) {
      const selectedAd = await Ad.find({ _id: req.params.adId });
      selectedAd && (data.ad = selectedAd);
    }

    res.status(200).json({
      status: 'success',
      resault: messages.length,
      data: data,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};
