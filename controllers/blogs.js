const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');

const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });

  res.json(blogs);
});

blogsRouter.get('/:id', async (req, res) => {
  const returnedBlog = await Blog.findById(req.params.id);

  if (returnedBlog) {
    res.json(returnedBlog);
  } else {
    res.status(404).end();
  }
});

blogsRouter.post('/', async (req, res) => {
  const body = req.body;

  console.log(req.headers);

  // if (!req.headers.authorization) {
  //   res.status(401).json({ error: 'Not Authorized' });
  // }

  const token = req.headers.authorization.split(' ')[1];

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  console.log('decodedToken', decodedToken);

  if (!token || !decodedToken.userId) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  const user = await User.findById(decodedToken.userId);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
  });
  res.json(updatedBlog);
});

blogsRouter.delete('/:id', async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(400).json({ error: 'blog not found' });
  }

  if (blog.user.toString() === decodedToken.id.toString()) {
    await blog.delete();
    res.status(204).end();
  } else {
    res.status(401).json({ error: 'you are not the creator of this blog' });
  }
});

module.exports = blogsRouter;
