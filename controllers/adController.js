const Ad = require('../models/adModel');

exports.getAllAd = async (req, res, next) => {
  try {
    const allAd = await Ad.find();
    res.status(200).json({
      status: 'success',
      result: allAd.length,
      data: allAd,
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
      data: allAd,
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
      data: newAd,
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
      data: null,
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
      data: updtedAd,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'data not found',
    });
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const ad = await Ad.findOne({
      category: { $elemMatch: { slug: req.params.category } },
    });

    res.status(200).json({
      status: 'success',
      result: ad.length,
      data: ad,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'data not found',
    });
  }
};
