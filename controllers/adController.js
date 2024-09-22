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

exports.getAdsByCategory = async (req, res, next) => {
  try {
    const cities = JSON.parse(decodeURIComponent(req.query.cities));

    let sortOptions;
    // { name: 'جدیدترین', slug: 'n' },
    // { name: 'ارزان‌ترین', slug: 'ch' },
    // { name: 'گران‌ترین', slug: 'ex' },
    // { name: 'نزدیک‌ترین', slug: 'cl' },
    // { name: 'کم کارکردترین', slug: 'lp' },
    // { name: 'پرکارکردترین', slug: 'hp' },
    // { name: 'قدیمی‌ترین سال', slug: 'oy' },
    // { name: 'جدیدترین سال', slug: 'ny' },
    if (req.query.o !== undefined) {
      req.query.o === 'n' && (sortOptions = { createAd: -1 });
      req.query.o === 'ch' &&
        (sortOptions = { attribute: { $elemMatch: { name: 'قیمت (تومان)' } } });
      req.query.o === 'ex' && (sortOptions = { createAd: -1 });
      req.query.o === 'cl' && (sortOptions = { createAd: -1 });
      req.query.o === 'lp' && (sortOptions = { createAd: -1 });
      req.query.o === 'cl' && (sortOptions = { createAd: -1 });
      req.query.o === 'oy' && (sortOptions = { createAd: 1 });
      req.query.o === 'ny' && (sortOptions = { createAd: 1 });
      req.query.o === 'hp' && (sortOptions = { createAd: 1 });
    }

    const ads = await Ad.find({
      location: { $elemMatch: { id: { $in: cities } } },
      category: { $elemMatch: { slug: req.params.category } },
    }).sort(sortOptions);

    // const ads = await Ad.aggregate([
    //   {
    //     $match: { category: { $elemMatch: { slug: req.params.category } } },
    //   },
    // ]);

    res.status(200).json({
      status: 'success',
      result: ads.length,
      data: ads,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'data not found',
    });
  }
};

// exports.getAdsByFilter = async (req, res, next) => {
//   try {
//     console.log(req.query);
//     const filters = req.query;

//     // const ads = await Ad.find({
//     //   category: { $elemMatch: { slug: req.params.category } },
//     // });

//     // res.status(200).json({
//     //   status: 'success',
//     //   result: ads.length,
//     //   data: ads,
//     // });
//   } catch (error) {
//     res.status(404).json({
//       status: 'fail',
//       message: 'data not found',
//     });
//   }
// };
