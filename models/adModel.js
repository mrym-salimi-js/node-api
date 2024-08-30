const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  descrioption: {
    type: String,
  },
  photo: [
    {
      id: Number,
      src: String,
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
      id: String,
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
