const protectedRouter = require('express').Router();
const { isAuth } = require('../utils/isAuth');

protectedRouter.post('/', (req, res) => {
  try {
    const userId = isAuth(req);

    if (userId !== null) {
      res.send({
        data: 'Protected data',
      });
    }
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});

module.exports = protectedRouter;
