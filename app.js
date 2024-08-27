const express = require('express');
const app = express();

app.use(express.json());
const adsRiutes = require('./routes/adsRoutes');
app.use('/api/ads/', adsRiutes);

console.log('hi from app');

module.exports = app;
