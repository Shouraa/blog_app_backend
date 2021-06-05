const blogsRouter = require('express').Router();
const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const mongooseUniqueValidator = require('mongoose-unique-validator');

const Blog = require('../models/blog');
// const User = require('../models/user');

blogsRouter.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
    });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
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

  // console.log(req.headers);
  // const token = req.headers.authorization.split(' ')[1];

  // const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  // console.log('decodedToken', decodedToken);

  // if (!token || !decodedToken.userId) {
  //   return res.status(401).json({ error: 'Authentication failed' });
  // }

  // const user = await User.findById(decodedToken.userId);

  const newBlog = new Blog(body);
  try {
    const savedBlog = await newBlog.save();
    // user.blogs = user.blogs.concat(savedBlog._id);
    // await user.save();

    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

blogsRouter.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const blog = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No blog was found');

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { ...blog, _id: id },
    { new: true }
  );

  res.json(updatedBlog);
});

blogsRouter.patch('/:id/like', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No blog was found');

  const blog = await Blog.findById(id);
  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    {
      likeCount: blog.likeCount + 1,
    },
    { new: true }
  );
  res.json(updatedBlog);
});

blogsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No blog was found');

  await Blog.findByIdAndRemove(id);

  res.json({ message: 'Blog deleted' });

  // const decodedToken = jwt.verify(req.token, process.env.SECRET);

  // if (!req.token || !decodedToken.id) {
  //   return res.status(401).json({ error: 'token missing or invalid' });
  // }

  // const blog = await Blog.findById(req.params.id);

  // if (!blog) {
  //   res.status(400).json({ error: 'blog not found' });
  // }

  // if (blog.user.toString() === decodedToken.id.toString()) {
  //   await blog.delete();
  //   res.status(204).end();
  // } else {
  //   res
  //     .status(401)
  //     .json({ error: 'you are not allowed to perform this action' });
  // }
});

module.exports = blogsRouter;

// if (!req.headers.authorization) {
//   res.status(401).json({ error: 'Not Authorized' });
// }
