const express = require('express');
const router = express.Router();

router
  .route('/')
  .get((req, res) => {
    res.status(200).json({
      status: 'success',
    });
  })
  .post(async (req, res) => {
    const ads = await req.body;

    res.status(200).json({
      status: 'success',
      data: {
        ads: ads,
      },
    });
  });

module.exports = router;
