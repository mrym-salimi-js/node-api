const Ad = require('../models/adModel');
const path = require('path');
const fs = require('fs-extra');
const { error } = require('console');
const User = require('../models/userModel');

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
    const ad = await Ad.findById(req.params.id);

    if (!ad) return;
    const adCreator = await User.findById(ad.userId);

    res.status(200).json({
      status: 'success',
      data: ad,
      adCreator: adCreator,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.createAd = async (req, res, next) => {
  try {
    let {
      photo,
      category,
      attribute,
      title,
      description,
      location,
      coordinate,
      userType,
      phone,
      chat,
      userId,
    } = req.body;

    photo = photo && JSON.parse(photo);
    category = category && JSON.parse(category);
    attribute = JSON.parse(attribute);
    title = JSON.parse(title);
    description = JSON.parse(description);
    location = JSON.parse(location);
    coordinate = JSON.parse(coordinate);

    const newAd = await Ad.create({
      photo,
      category,
      attribute,
      title,
      description,
      location,
      coordinate,
      userType,
      phone,
      chat,
      userId,
    });

    if (newAd && newAd.photo.length > 0) {
      newAd.photo.map((p) => {
        const sourcePath = path.join(__dirname, `../public/temp/`, p.name);
        const destPath = path.join(
          __dirname,
          `../public/img/${newAd._id.toString()}`,
          p.name,
        );
        fs.move(sourcePath, destPath);
      });
    }

    res.status(201).json({
      status: 'success',
      data: newAd,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
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

    let aQueries = [];
    for (const queryKey in req.query) {
      if (queryKey.startsWith('a')) {
        aQueries.push(req.query[queryKey]);
      }
    }

    let ads = [];
    const category = await Ad.find({
      category: { $elemMatch: { slug: req.params.category } },
    });
    ads = category;

    const queries = req.query ? req.query : {};

    for (let queryKey in queries) {
      // Get Cities
      if (queryKey === 'cities') {
        const location = [];
        ads.find((item) => {
          item.location.find((locItem) => {
            if (
              JSON.parse(decodeURIComponent(req.query.cities)).includes(
                locItem.id,
              )
            ) {
              location.push(item);
            }
          });
        });

        ads = location;
      }

      // Get Querykey StartWith "a"
      if (queryKey.startsWith('a')) {
        const aQuery = [];
        ads.find((item) => {
          item.attribute?.find((attrItem) => {
            if (queries[queryKey] === attrItem.lableId) {
              aQuery.push(item);
            }
            console.log(queries[queryKey] === attrItem.lableId);
          });
        });

        ads = aQuery;
      }

      // Get Querykey StartWith "mx"
      if (queryKey.startsWith('mx')) {
        let mxQuery = [];
        ads.find((adItem) => {
          adItem.attribute?.find((attrItem) => {
            if (
              attrItem.id == queryKey.split(/[mx]/g).join('') &&
              attrItem.lable <= parseInt(queries[queryKey])
            ) {
              mxQuery.push(adItem);
            }
          });
        });

        ads = mxQuery;
      }

      // Get Querykey StartWith "mn"
      if (queryKey.startsWith('mn')) {
        let mnQuery = [];
        ads.find((adItem) => {
          adItem.attribute?.find((attrItem) => {
            if (
              attrItem.id == queryKey.split(/[mn]/g).join('') &&
              attrItem.lable >= parseInt(queries[queryKey])
            ) {
              mnQuery.push(adItem);
            }
          });
        });
        ads = mnQuery;
      }
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

    // let mxMnElems;
    // Object.keys(req.query).map((key) => {
    //   if (key.startsWith('mx')) {
    //     key === 'mx45213' &&
    //       (mxMnElems = {
    //         $elemMatch: {
    //           name: 'متراژ',
    //           lable: {
    //             $lt: parseInt(queries[key]),
    //           },
    //         },
    //       });
    //   }
    // });

    // ads = await Ad.find({

    //   // $and: Object.keys(queries).map((key) => {
    //   //   if (key.startsWith('mx')) {
    //   //     key === 'mx45213' && {
    //   //       attribute: {
    //   //         $elemMatch: {
    //   //           name: 'متراژ',
    //   //           lable: {
    //   //             $lt: parseInt(queries[key]),
    //   //           },
    //   //         },
    //   //       },
    //   //     };
    //   //   }
    //   // }),

    //   // attribute: {
    //   //   $elemMatch: { lableId: { $in: aQueries } },
    //   //   $elemMatch: {
    //   //     name: 'قیمت (تومان)',
    //   //     lable: {
    //   //       $lt: req.query.mx45213 ? parseInt(req.query.mx45213) : 0,
    //   //     },
    //   //   },
    //   //   $elemMatch: {
    //   //     name: 'متراژ',
    //   //     lable: {
    //   //       $lt: req.query.mx8888 ? parseInt(req.query.mx8888) : 0,
    //   //     },
    //   //   },
    //   // },
    // });

    // const ads = await Ad.aggregate([
    //   {
    //     $match: {
    //       category: { $elemMatch: { slug: req.params.category } },
    //       location: {
    //         $elemMatch: {
    //           id: { $in: JSON.parse(decodeURIComponent(req.query.cities)) },
    //         },
    //       },
    //     },
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
      message: error.message,
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
