const mongoose = require('mongoose');

('userType, phone, chat');

const adSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  descrioption: {
    type: String,
  },
  photo: [String],
  category: [
    {
      id: Number,
      name: String,
      slug: String,
    },
  ],
  location: [
    {
      id: Number,
      name: String,
      slug: String,
      coordinates: [Number],
    },
  ],
  attribute: [
    {
      id: Number,
      name: String,
      lable: String,
    },
  ],
  userType: {
    type: String,
  },
  phone: {
    type: Number,
  },
  chat: {
    type: Boolean,
  },
});

const Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;
