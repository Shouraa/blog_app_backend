const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
  const body = request.body;

  const user = await User.findOne({ username: body.username });

  const passwordCheck =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);

  if (!(user && passwordCheck)) {
    throw new Error('Invalid credentials');
  }

  const tokenHolder = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(tokenHolder, process.env.SECRET);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
