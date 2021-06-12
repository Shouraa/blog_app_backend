const mongoose = require('mongoose');
const Blog = require('../models/blog');

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
    });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const returnedBlog = await Blog.findById(id);

    res.status(200).json(returnedBlog);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createBlog = async (req, res) => {
  const body = req.body;

  const newBlog = new Blog(body);
  try {
    const savedBlog = await newBlog.save();

    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const updateBlog = async (req, res) => {
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
};

const likeBlog = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) return res.json({ message: 'Not Authenticated ' });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No blog was found');

  const blog = await Blog.findById(id);

  const index = blog.likeCount.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    blog.likeCount.push(req.userId);
  } else {
    blog.likeCount = blog.likeCount.filter((id) => id !== String(req.userId));
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });
  res.json(updatedBlog);
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No blog was found');

  await Blog.findByIdAndRemove(id);

  res.json({ message: 'Blog deleted' });
};

module.exports = {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  likeBlog,
  deleteBlog,
};
