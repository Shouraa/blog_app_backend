const logoutRouter = require('express').Router();

logoutRouter.post('/', (_req, res) => {
  res.clearCookie('refreshtoken', { path: 'api/refresh_token' });
  return res.send({
    message: 'Logged out',
  });
});

module.exports = logoutRouter;
