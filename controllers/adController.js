const Ad = require('../models/adModel');
const fs = require('fs-extra');
const User = require('../models/userModel');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const client = require('../utils/s3Client');
require('dotenv').config();

// اتصال به Object Storage لیارا
const s3Client = client;

exports.getAllAd = async (req, res, next) => {
  try {
    let ads;
    if (req.query.cities !== undefined) {
      const cities = JSON.parse(decodeURIComponent(req.query.cities));
      ads = await Ad.find({
        location: { $elemMatch: { id: { $in: cities } } },
      });
    } else {
      ads = await Ad.find();
    }
    res.status(200).json({
      status: 'success',
      result: ads.length,
      data: ads,
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

exports.createAd = async (req, res) => {
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

    // مطمئن شدن از آماده بودن فیلدها
    if (!title || !description || !category || !userId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing required fields',
      });
    }

    photo = photo ? JSON.parse(photo) : [];
    category = category ? JSON.parse(category) : [];
    attribute = attribute ? JSON.parse(attribute) : [];
    title = title ? JSON.parse(title) : '';
    description = description ? JSON.parse(description) : '';
    location = location ? JSON.parse(location) : {};
    coordinate = coordinate ? JSON.parse(coordinate) : {};

    const newAd = await Ad.create({
      photo: [],
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

    // کمی delay کوچک برای اطمینان از آماده بودن فایل‌ها (حل race condition موبایل)
    await new Promise((resolve) => setTimeout(resolve, 50));

    if (req.files && req.files.length > 0) {
      const uploadedPhotos = [];
      for (const file of req.files) {
        const fileKey = `${newAd._id}/${Date.now()}-${file.originalname}`;
        const params = {
          Body: file.buffer,
          Bucket: process.env.LIARA_BUCKET_NAME,
          Key: fileKey,
        };

        await s3Client.send(new PutObjectCommand(params));

        const fileUrl = `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${fileKey}`;
        uploadedPhotos.push({ name: file.originalname, url: fileUrl });
      }

      newAd.photo = uploadedPhotos;
      await newAd.save();
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

// exports.getAdsByLocations = async (req, res, next) => {
//   try {

//     res.status(200).json({
//       status: 'success',
//       message: ad,
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: 'fail',
//       message: 'data not found',
//     });
//   }
// };
exports.getAdsByCategory = async (req, res, next) => {
  try {
    if (req.query.o !== undefined) {
      req.query.o === 'n' && (sortOptions = { createAt: -1 });
      req.query.o === 'ch' && (sortOptions = { lable: 1 });
      req.query.o === 'ex' && (sortOptions = { createAt: -1 });
      req.query.o === 'lp' && (sortOptions = { createAt: -1 });
      req.query.o === 'oy' && (sortOptions = { createAt: 1 });
      req.query.o === 'ny' && (sortOptions = { createAt: 1 });
      req.query.o === 'hp' && (sortOptions = { createAt: 1 });
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
            if (parseInt(queries[queryKey]) === attrItem.lableId) {
              aQuery.push(item);
            }
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
              (attrItem.id == queryKey.split(/[mx|a]/g).join('') ||
                (queryKey.split(/[mx|a]/g).join('') == 'p' &&
                  attrItem.id == 1)) &&
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
              (attrItem.id == queryKey.split(/[mn|a]/g).join('') ||
                (queryKey.split(/[mn|a]/g).join('') == 'p' &&
                  attrItem.id == 1)) &&
              attrItem.lable >= parseInt(queries[queryKey])
            ) {
              mnQuery.push(adItem);
            }
          });
        });
        ads = mnQuery;
      }

      if (queryKey.startsWith('o')) {
        //{ name: 'جدیدترین', slug: 'n' }
        //{ name: 'ارزان ترین', slug: 'ch' }
        //{ name: 'گران ترین', slug: 'ex' }
        // { name: 'کم کارکردترین', slug: 'lp' }, ----> km
        // { name: 'پرکارکردترین', slug: 'hp' },
        // { name: 'قدیمی‌ترین سال', slug: 'oy' }, ----> year
        // { name: 'جدیدترین سال', slug: 'ny' },
        queries[queryKey] === 'n' &&
          ads.sort((timeA, timeB) => {
            return timeA - timeB;
          });
        (queries[queryKey] === 'ch' || queries[queryKey] === 'ex') &&
          ads.sort((a, b) => {
            const priceA = parseInt(
              a.attribute.find(
                (attr) =>
                  attr.id === 1 || attr.id === 68090 || attr.id === 68093,
              ).lable,
              10,
            );
            const priceB = parseInt(
              b.attribute.find(
                (attr) =>
                  attr.id === 1 || attr.id === 68090 || attr.id === 68093,
              ).lable,
              10,
            );
            return queries[queryKey].startsWith('ch')
              ? priceA - priceB
              : priceB - priceA;
          });
        (queries[queryKey] === 'lp' || queries[queryKey] === 'hp') &&
          ads.sort((a, b) => {
            const priceA = parseInt(
              a.attribute.find((attr) => attr.name === 'کیلومتر').lable,
              10,
            );
            const priceB = parseInt(
              b.attribute.find((attr) => attr.name === 'کیلومتر').lable,
              10,
            );
            return queries[queryKey].startsWith('lp')
              ? priceA - priceB
              : priceB - priceA;
          });
        (queries[queryKey] === 'oy' || queries[queryKey] === 'ny') &&
          ads.sort((a, b) => {
            const priceA = parseInt(
              a.attribute.find((attr) => attr.name === 'سن بنا').lableId,
              10,
            );
            const priceB = parseInt(
              b.attribute.find((attr) => attr.name === 'سن بنا').lableId,
              10,
            );
            return queries[queryKey].startsWith('ny')
              ? priceA - priceB
              : priceB - priceA;
          });
      }

      if (queryKey.startsWith('wp')) {
        queries['wp'] === 'true'
          ? (ads = ads.filter((ad) => {
              return ad.photo[0] && ad;
            }))
          : (ads = ads.filter((ad) => {
              return !ad.photo[0] && ad;
            }));
      }
    }

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
