const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const { Server } = require('socket.io');
const Chat = require('./models/chatModel');

const { PutObjectCommand } = require('@aws-sdk/client-s3');
// const s3Client = require('./utils/s3Client'); // مثل همون که برای پروفایل داری

const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Database connection with mongoose
const dbUri = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);
// console.log(dbUri);
mongoose
  .connect(dbUri)
  .then(() => {
    console.log('Connected to database successfully');
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

// Server connection
const port = process.env.PORT;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`App is running on port ${port}`);
});

// Socket Connection
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  // Set Message
  socket.on('sendMessage', async ({ adId, senderId, reciverId, message }) => {
    const chat = new Chat({
      adId: adId,
      senderId: senderId,
      reciverId: reciverId,
      message: message,
      type: 'text',
    });

    if (!message) return;

    await chat.save();

    // socket.emit('message', { chatId, senderId, reciverId, message });
    socket.broadcast.emit('message', { adId, senderId, reciverId, message });
  });

  // Set File

  socket.on('uploadFile', async ({ adId, senderId, reciverId, fileInfo }) => {
    if (!fileInfo) return console.error('Invalid fileInfo');

    try {
      // آپلود فایل به لیارا
      const fileName = `${Date.now()}_${fileInfo.fileName}`;

      const response = await imagekit.upload({
        file: fileInfo.file,
        fileName,
        folder: `/sheypoorchi/chat/${senderId}-${reciverId}-${adId}`,
      });

      const fileUrl = response.url;
      // ذخیره در دیتابیس
      const chat = new Chat({
        adId,
        senderId,
        reciverId,
        message: fileUrl,
        type: 'file',
        size: fileInfo.size,
      });
      await chat.save();

      // ارسال فایل برای همه (از جمله خود فرستنده)
      const payload = {
        adId,
        senderId,
        reciverId,
        fileInfo: { ...fileInfo, url: fileUrl },
      };
      io.emit('file', payload); // این همه رو آپدیت می‌کنه

      socket.emit('upload success', 'File uploaded successfully');
    } catch (err) {
      console.error(err);
      socket.emit('upload error', 'Error uploading file');
    }
  });
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on('disconnect', async () => {
    // console.log('disconnect');
  });
});
