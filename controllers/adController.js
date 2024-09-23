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
    // { name: 'ارزان‌ترین', slug: 'ch' }, ---> price
    // { name: 'گران‌ترین', slug: 'ex' },
    // { name: 'کم کارکردترین', slug: 'lp' }, ----> km
    // { name: 'پرکارکردترین', slug: 'hp' },
    // { name: 'قدیمی‌ترین سال', slug: 'oy' }, ----> year
    // { name: 'جدیدترین سال', slug: 'ny' },
    if (req.query.o !== undefined) {
      req.query.o === 'n' && (sortOptions = { createAd: -1 });
      req.query.o === 'ch' && (sortOptions = { lable: 1 });
      req.query.o === 'ex' && (sortOptions = { createAd: -1 });
      req.query.o === 'lp' && (sortOptions = { createAd: -1 });
      req.query.o === 'oy' && (sortOptions = { createAd: 1 });
      req.query.o === 'ny' && (sortOptions = { createAd: 1 });
      req.query.o === 'hp' && (sortOptions = { createAd: 1 });
    }

    // mx68101 => حداکثر سال تولید
    // mx97023 => --
    // mx68140 => --
    // mx68102 => حداکثر کیلومتر
    // mx97024 => --
    // mx68141 => --
    // mx68085 => حداکثر متراژ
    // mx68090 => حداکثر رهن
    // mx68091 => --
    // mx68092 => حداکثر اجاره
    // mx68093 => --
    // mx70020 => حداکثر اجاره روزانه
    const ads = await Ad.find({
      location: { $elemMatch: { id: { $in: cities } } },
      category: { $elemMatch: { slug: req.params.category } },
      attribute: {
        $elemMatch: {
          name: 'قیمت (تومان)',
          lable: {
            $gt: parseInt(req.query.mx45213) ? parseInt(req.query.mx8888) : 0,
          },
        },
        $elemMatch: {
          name: 'متراژ',
          lable: {
            $gt: parseInt(req.query.mx8888) ? parseInt(req.query.mx8888) : 0,
          },
        },
      },
    }).sort(sortOptions);

    // const ads = await Ad.aggregate([
    //   {
    //     $match: {
    //       category: { $elemMatch: { slug: req.params.category } },
    //       location: { $elemMatch: { id: { $in: cities } } },
    //     },
    //   },
    //   { $unwind: '$attribute' },
    //   { $sort: { 'attribute.lable': -1 } },
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
