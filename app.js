const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const adminBroRouter = require('./AdminBroRouter');
const { adminBroInstance } = require('./AdminBroRouter');

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

  // admin panel
  app.use(adminBroInstance.options.rootPath, adminBroRouter);
  
  // posts
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use('/posts', postsRouter);

  app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
  });
};

run();
