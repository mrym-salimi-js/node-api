const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const { Server } = require('socket.io');

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
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

// Socket Connection
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  socket.on('sendMessage', async ({ adId, senderId, reciverId, message }) => {
    const chat = new Chat({
      adId: adId,
      senderId: senderId,
      reciverId: reciverId,
      message: message,
    });

    if (!message) return;
    await chat.save();

    // socket.emit('message', { chatId, senderId, reciverId, message });
    socket.broadcast.emit('message', { adId, senderId, reciverId, message });
  });
  socket.on('disconnect', () => {
    // console.log('Client disconnected');
  });
});
