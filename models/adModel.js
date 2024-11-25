const mongoose = require('mongoose');
const adController = require('../controllers/adController');

const adSchema = new mongoose.Schema({
  title: String,
  description: String,
  photo: [
    {
      id: Number,
      name: String,
    },
  ],
  category: [
    {
      id: String,
      name: String,
      slug: String,
    },
  ],
  location: [
    {
      id: Number,
      name: String,
      slug: String,
      lat: String,
      lon: String,
    },
  ],
  coordinate: {
    lat: Number,
    lon: Number,
  },
  attribute: [
    {
      id: Number,
      name: String,
      lable: String,
      lableId: Number,
    },
  ],
  userId: String,
  userType: String,
  phone: Boolean,
  chat: Boolean,
  createAd: {
    type: Number,
    default: () => {
      return new Date();
    },
  },
});

const Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;
