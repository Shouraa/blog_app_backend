const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');

const config = require('./utils/config');
const logger = require('./utils/logger');

const loginRouter = require('./controllers/login');
const usersRouter = require('./controllers/users');
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');

const url = config.MONGODB_URI;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });
logger.info('connecting to', config.MONGODB_URI);

// app.use(express.static('build'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(middleware.tokenExtractor);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
