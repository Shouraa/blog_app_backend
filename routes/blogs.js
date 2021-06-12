const blogsRouter = require('express').Router();
const auth = require('../utils/middleware/auth');

const {
  getBlogs,
  createBlog,
  updateBlog,
  likeBlog,
  deleteBlog,
} = require('../controllers/blogs');

blogsRouter.get('/', getBlogs);
blogsRouter.post('/', auth, createBlog);
blogsRouter.patch('/:id', auth, updateBlog);
blogsRouter.patch('/:id/like', auth, likeBlog);
blogsRouter.delete('/:id', auth, deleteBlog);

module.exports = blogsRouter;
