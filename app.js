const express = require('express');
const adsRiutes = require('./routes/adsRoutes');

const app = express();

// MIDDLEWARE:

// --JASONPARSER
app.use(express.json());

// --Routes
app.use('/api/ads/', adsRiutes);

// ---404 ERROR (NOT FOUND) => EXIST IN REACT APP
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: 'آدرس معتبر نمی باشد',
  });
});

module.exports = app;
