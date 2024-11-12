const express = require('express');
const adsRiutes = require('./routes/adsRoutes');
const userRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();

// MIDDLEWARE:

//--RATE LIMITING (set a limite fir login => each 1 minuste can try 5 times)

const limiter = rateLimit({
  max: 5,
  windowMs: 60 * 1000,
  message:
    'تعداد تلاش برای ورود بیش از اندازه مجاز است، لطفا دقایقی دیگر مجددا تلاش منید',
});

app.use('/api/users/login', limiter);

// --HTTP RESPONSE HEADERS
app.use(helmet());

// --JASONPARSER (read the data from req.body)
app.use(express.json());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// --CORS policy
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
// --Routes
app.use('/api/ads/', adsRiutes);
app.use('/api/users/', userRoutes);

// ---404 ERROR (NOT FOUND ROUT) => EXIST IN REACT APP
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: 'صفحه ای با این نشانی یافت نشد!',
  });
});

module.exports = app;
