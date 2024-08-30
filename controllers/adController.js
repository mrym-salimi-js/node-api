const Ad = require('../models/adModel');

exports.getAllAd = async (req, res, next) => {
  try {
    const allAd = await Ad.find();
    res.status(200).json({
      status: 'success',
      result: allAd.length,
      message: allAd,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'data not found',
    });
  }
};

exports.createAd = async (req, res, next) => {
  try {
    const newAd = await Ad.create(req.body);

    res.status(201).json({
      status: 'success',
      message: newAd,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'something went wrong',
    });
  }
};
