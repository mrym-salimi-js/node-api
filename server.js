const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

// Database connection with mongoose
const dbUri = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(dbUri);

// Server connection
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
