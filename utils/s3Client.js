// s3Client.js
const { S3Client } = require('@aws-sdk/client-s3');
require('dotenv').config();

const client = new S3Client({
  region: 'default',
  endpoint: process.env.LIARA_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY,
    secretAccessKey: process.env.LIARA_SECRET_KEY,
  },
});

module.exports = client;
