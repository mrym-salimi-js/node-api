const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const fCreater = require('fs-extra');
const Chat = require('./models/chatModel');

// Database connection with mongoose
const dbUri = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);
// console.log(dbUri);
mongoose.connect(dbUri).then(console.log('connect to database'));

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
    // const buffer = Buffer.from(file.file);
    // console.log(adId);
    if (!fileInfo) {
      console.error('Invalid fileInfo');
      return;
    }
    const chat = new Chat({
      adId: adId,
      senderId: senderId,
      reciverId: reciverId,
      message: fileInfo.fileName,
      type: 'file',
      size: fileInfo.size,
    });
    if (!fileInfo) return;

    await chat.save();
    socket.broadcast.emit('file', { adId, senderId, reciverId, fileInfo });

    if (!chat) return;

    const chatsFilePath = `public/chat/${senderId}-${reciverId}-${adId}`;
    await fCreater.ensureDir(chatsFilePath);
    const filePath = path.join(__dirname, chatsFilePath, fileInfo?.fileName);

    fs.writeFile(filePath, fileInfo.file, (error) => {
      if (error) {
        console.error(error);
        socket.emit('upload error', 'Error saving file');
        return;
      }

      console.log('File saved:', filePath);
      socket.emit('upload success', 'File uploaded successfully');
    });
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
  socket.on('disconnect', () => {
    // console.log('Client disconnected');
  });
});
