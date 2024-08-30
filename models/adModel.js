const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: String,
  descrioption: String,
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
  userType: String,
  phone: Number,
  chat: Boolean,
});

const Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;
