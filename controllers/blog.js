const { BlogService } = require("../services/blog");
const Joi = require("joi");
const blogService = new BlogService();

/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('../utils/types/express').StandardResponse} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
async function createBlog(req, res) {
  try {
    const title = req.body.title;
    if (!title) return res.apiError("Title is required", 400);
    const uri = req.body.uri;

    try {
      const createdBlog = await blogService.createBlog(title, uri);
      return res.apiSuccess(createdBlog);
    } catch (err) {
      return res.apiError(err.message, err.statusCode);
    }
  } catch (err) {
    res.apiError("Internal server error", 500);
  }
}

/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('../utils/types/express').StandardResponse} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
async function getBlogs(req, res) {
  try {
    const id = req.query.id;
    if (id) {
      const resp = await blogService.getBlogs(id);
      if (resp.length > 0) {
        return res.apiSuccess(resp[0]);
      } else {
        return res.apiError("Blog with specified id not found", 404);
      }
    } else {
      const resp = await blogService.getBlogs();
      res.apiSuccess(resp);
    }
  } catch (err) {
    res.apiError(err.message, 500);
  }
}
/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('../utils/types/express').StandardResponse} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
async function getBlogByURI(req, res) {
  try {
    const uri = req.params.blogUri;
    const blog = await blogService.getBlogByURI(uri);
    res.apiSuccess(blog);
  } catch (err) {
    res.apiError(err.message || "Internal Server Error", err.statusCode || 500);
  }
}

/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('../utils/types/express').StandardResponse} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
async function removeBlog(req, res) {
  const blogId = req.params.blogId;
  if (!blogId) return res.apiError("Id is required", 400);
  try {
    blogService.deleteBlog(blogId);
    return res.apiSuccess("deleted");
  } catch (err) {
    res.apiError(err.message || "Internal server error", err.statusCode || 500);
  }
}

const editBlogSchema = Joi.object({
  id: Joi.number().required(),
  body: Joi.string(),
  shortDescription: Joi.string(),
  title: Joi.string(),
  uri: Joi.string(),
});

/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('../utils/types/express').StandardResponse} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
async function editBlog(req, res) {
  try {
    const { value, error } = editBlogSchema.validate(req.body);
    if (error) return res.apiError(error.details[0].message, 400);
    const editedBlog = await blogService.updateBlog(value.id, value);
    res.apiSuccess(editedBlog);
  } catch (err) {
    res.apiError(err.message || "Internal server error", err.statusCode || 500);
  }
}

module.exports = { createBlog, editBlog, getBlogByURI, getBlogs, removeBlog };
