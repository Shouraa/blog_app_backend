const refreshtokenRouter = require('express').Router();
const { verify } = require('jsonwebtoken');
const User = require('../models/user');
const {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require('../utils/tokens');

// get a new access token with a refresh token
refreshtokenRouter.post('/', async (req, res) => {
  const token = req.cookies.refreshtoken;
  console.log(token);

  // if we don't have a token in our request
  if (!token) return res.send({ accesstoken: '' });

  // we have a token, verify it
  let payload = null;

  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
    console.log('payload', payload);
  } catch (err) {
    return res.send({ accesstoken: ' ' });
  }

  // token is valid, checking if user exists
  const user = await User.findById(payload.userId);
  if (!user) return res.send({ accesstoken: ' ' });

  //user exists, check if refresh token exists on user
  if (user.refreshtoken !== token) {
    return res.send({ accesstoken: ' ' });
  }
  // token exists, create new refresh and access token
  const accesstoken = createAccessToken(user.id);
  const refreshtoken = createRefreshToken(user.id);
  console.log('refreshtoken', refreshtoken);
  user.refreshtoken = refreshtoken;
  await user.save();

  sendRefreshToken(res, refreshtoken);
  sendAccessToken(user.username, res, accesstoken);
});

module.exports = refreshtokenRouter;
