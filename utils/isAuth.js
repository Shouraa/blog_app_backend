const { verify } = require('jsonwebtoken');

const isAuth = (req) => {
  const authorization = req.headers['authorization'];
  console.log('Auth', authorization);
  if (!authorization) throw new Error('Please login!');
  const token = authorization.split(' ')[1];

  const { userId } = verify(token, process.env.ACCESS_TOKEN_SECRET);
  console.log(userId);

  return userId;
};

module.exports = {
  isAuth,
};
