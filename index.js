const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const config = require('./utils/config');
const logger = require('./utils/logger');

// const logoutRouter = require('./controllers/logout');
// const protectedRouter = require('./controllers/protected');
// const loginRouter = require('./controllers/login');
// const usersRouter = require('./controllers/users');
// const refreshtokenRouter = require('./controllers/refresh_token');
// const middleware = require('./utils/middleware');
const blogsRouter = require('./controllers/blogs');

const app = express();

logger.info('connecting to', config.MONGODB_URI);

// app.use(express.static('build'));

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(middleware.tokenExtractor);

app.use('/api/blogs', blogsRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the app API');
});

// app.use('/api/users', usersRouter);
// app.use('/api/login', loginRouter);
// app.use('/api/protected', protectedRouter);
// app.use('/api/refresh_token', refreshtokenRouter);
// app.use('/api/logout', logoutRouter);

// app.use(middleware.unknownEndpoint);
// app.use(middleware.errorHandler);

console.log(typeof config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() =>
    app.listen(config.PORT, () =>
      logger.info(`Server Running on Port: http://localhost:${config.PORT}`)
    )
  )
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

// {
//     origin: 'http://localhost:3000',
//     credentials: true,
//   }
