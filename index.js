const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const config = require('./utils/config');
const logger = require('./utils/logger');

const usersRouter = require('./routes/user');
const blogsRouter = require('./routes/blogs');

const app = express();

logger.info('connecting to', config.MONGODB_URI);

// app.use(express.static('build'));

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', usersRouter);
app.use('/api/blogs', blogsRouter);

// app.get('/', (req, res) => {
//   res.send('Welcome to the app API');
// });

console.log(process.env.MONGODB_URI);

const MONGODB_URI =
  'mongodb+srv://fullstack:farhangkuni@cluster0.cjkmw.mongodb.net/thesis-app?retryWrites=true&w=majority';

mongoose
  .connect(MONGODB_URI, {
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
