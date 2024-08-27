const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
