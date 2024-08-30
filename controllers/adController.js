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

exports.getAd = async (req, res, next) => {
  try {
    const allAd = await Ad.findById(req.params.id);

    res.status(200).json({
      status: 'success',
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

exports.deleteAd = async (req, res, next) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      message: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'data not found',
    });
  }
};

exports.updateAd = async (req, res, next) => {
  try {
    const updtedAd = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      message: updtedAd,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'data not found',
    });
  }
};
