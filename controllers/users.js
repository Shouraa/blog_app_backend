const bcrypt = require('bcrypt');

const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs');

  res.json(users);
});

usersRouter.post('/register', async (req, res) => {
  const body = req.body;
  if (body.password === undefined || body.password.length < 3) {
    res.status(400).json({ error: 'password missing or too short' });
  }

  try {
    const user = await User.findOne({ username: body.username });
    if (user) throw new Error('User already exist');

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const newUser = new User({
      username: body.username,
      name: body.name,
      passwordHash,
      blogs: [],
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});

module.exports = usersRouter;
