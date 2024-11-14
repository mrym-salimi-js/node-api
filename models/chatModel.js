const { default: mongoose } = require('mongoose');

const userChat = new mongoose.Schema({
  chatId: Number,
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  reciverId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
  createAd: {
    type: Number,
    default: () => {
      return new Date();
    },
  },
});

const Chat = mongoose.model('Chat', userChat);

module.exports = Chat;
