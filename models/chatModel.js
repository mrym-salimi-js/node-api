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
  adId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ad',
    required: true,
  },
  type: String,
  size: Number,
  createAt: {
    type: Number,
    default: () => {
      return new Date();
    },
  },
});
userChat.index({ senderId: 1, reciverId: 1, adId: 1 });

const Chat = mongoose.model('Chat', userChat);

module.exports = Chat;
