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
    // 1. گرفتن چت‌ها
    const chats = await Chat.find({
      $or: [{ senderId: req.user.id }, { reciverId: req.user.id }],
    }).sort({ createdAt: 1 });

    // 2. گروه بندی بر اساس adId
    const grouped = chats.reduce((acc, chat) => {
      const adId = chat.adId.toString();
      if (!acc[adId]) acc[adId] = [];
      acc[adId].push(chat);
      return acc;
    }, {});

    // 3. ساخت لیست کانتکت‌ها بدون تکراری
    const contacts = [];
    const addedChatIds = new Set();

    for (const [adId, chatArray] of Object.entries(grouped)) {
      const firstMessage = chatArray[0];
      const isBuyer =
        firstMessage.senderId.toString() === req.user.id.toString();

      if (isBuyer) {
        const ad = await Ad.findById(adId);
        if (!addedChatIds.has(ad?.id)) {
          contacts.push({
            chatId: ad?.id,
            creatorId: ad?.userId,
            adName: ad?.title,
            photo: ad?.photo,
            createAt: chatArray[chatArray.length - 1]?.createAt,
          });
          addedChatIds.add(ad?.id);
        }
      } else {
        const buyer = await User.findById(firstMessage.senderId).select(
          'name avatar email',
        );
        if (!addedChatIds.has(buyer?.id)) {
          contacts.push({
            chatId: buyer?.id,
            creatorId: buyer?.userId,
            adName: buyer?.name,
            photo: buyer?.photo,
            createAt: chatArray[chatArray.length - 1]?.createAt,
          });
          addedChatIds.add(buyer?.id);
        }
      }
    }

    res.status(200).json({
      status: 'success',
      result: contacts.length,
      data: contacts,
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
    // 1. گرفتن چتهایی ک ه کاربر درش حضور داره
    const chats = await Chat.find({
      $or: [{ senderId: req.user.id }, { reciverId: req.user.id }],
    })
      .populate('adId')
      .lean();

    // 2. فیلتر چت ها براساس ایدی دریافتی از فرانت
    const filteredChats = chats.filter(
      (i) =>
        i.adId._id.toString() === req.params.adId.toString() ||
        i.senderId.toString() === req.params.adId.toString() ||
        i.reciverId.toString() === req.params.adId.toString(),
    );

    // 3. گروه بندی بر اساس adId

    const grouped = filteredChats.reduce((acc, chat) => {
      const adId = chat.adId?._id.toString(); // adId از populate
      if (!acc[adId]) {
        acc[adId] = {
          ad: chat.adId, // اطلاعات آگهی
          messages: [], // آرایه پیام‌ها
        };
      }
      acc[adId].messages.push(chat);
      return acc;
    }, {});

    // 4. ساخت لیست پیام های چت

    const chat = [];

    for (const [adId, chatGroup] of Object.entries(grouped)) {
      const firstMessage = chatGroup?.messages[0]; // اولین پیام
      const inAdMood =
        firstMessage.adId?._id.toString() === req.params.adId.toString();

      // console.log(isBuyer);
      if (inAdMood) {
        // کاربر خریدار است
        chat.push(chatGroup); // کل آبجکت شامل ad و messages
      } else {
        // کاربر فروشنده است
        firstMessage.senderId.toString() !== req.user.id.toString() &&
          chat.push(chatGroup);
      }
    }

    res.status(200).json({
      status: 'success',
      result: chat?.message?.length,
      data: chat,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};
