const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  console.log('req.body', req.body);
  try {
    const token = req.headers.authorization.split(' ')[1];

    let decodedData = jwt.verify(token, 'test');

    req.userId = decodedData?.id;

    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = auth;
