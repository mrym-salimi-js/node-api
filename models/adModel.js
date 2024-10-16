const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: String,
  descrioption: String,
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
      coordinates: [Number],
    },
  ],
  attribute: [
    {
      id: Number,
      name: String,
      lable: String,
      lableId: Number,
    },
  ],

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
