const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const router = require('./AdminBroRouter');
const { adminBroInstance } = require('./AdminBroRouter');

// custom middleware for adminBro
const adminBroMiddleware = require('./middleware/adminBro');

const postsRouter = require('./routes/posts');

// env variables
const PORT = process.env.PORT;
const CONNECTION_URL = process.env.CONNECTION_URL;


const app = express();
app.use(cors());
app.use(morgan('dev'));

// start
const run = async () => {
  const db = await mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true });

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
  });

  app.use(`${adminBroInstance.options.rootPath}/api/resources/post/actions/new`, adminBroMiddleware);
  app.use(adminBroInstance.options.rootPath, router);

  app.use('/posts', postsRouter);

  app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
  });
};

run();
