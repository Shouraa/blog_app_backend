const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

const {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require('../utils/tokens');

loginRouter.post('/', async (req, res) => {
  const body = req.body;

  try {
    const user = await User.findOne({ username: body.username });

    const passwordCheck = !user
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);

    if (!passwordCheck) {
      throw new Error('Invalid credentials');
    }
    const accesstoken = createAccessToken(user.id);
    const refreshtoken = createRefreshToken(user.id);

    user.refreshtoken = refreshtoken;
    await user.save();

    sendRefreshToken(res, refreshtoken);
    sendAccessToken(user.username, res, accesstoken);
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});

module.exports = loginRouter;
