const usersRouter = require('express').Router();

const { signin, signup } = require('../controllers/users');

usersRouter.post('/signin', signin);
usersRouter.post('/signup', signup);

module.exports = usersRouter;
