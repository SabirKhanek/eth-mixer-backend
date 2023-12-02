const { Blog } = require("../database");
const { CustomError } = require("../utils/errors");

class BlogService {
  /**
   *
   * @param {string} title
   * @param {string} uri
   */
  async createBlog(title, uri) {
    if (!uri) {
      uri = title.replace(/\s+/g, "-");
    }
    try {
      const blog = await this.getBlogByURI(uri);
      uri += `-${new Date().getTime()}`;
    } catch {}

    const blog = await Blog.findOne({ where: { title } });
    if (blog) throw new CustomError("Blog with the title already exists", 400);

    const newBlog = await Blog.create({
      title,
      uri,
    });
    return newBlog;
  }

  /**
   *
   * @param {number} id
   * @param {object} newObj
   * @param {string} newObj.body
   * @param {string} newObj.uri
   * @param {string} newObj.title
   * @param {string} newObj.shortDescription
   */
  async updateBlog(id, newObj) {

    const blog = await Blog.findByPk(id);
    if (!blog) throw new CustomError("Blog with specified id not found", 404);
    if (newObj.body) blog.body = newObj.body;
    if (newObj.uri) {
      try {
        const _blog = await this.getBlogByURI(newObj.uri);
        if (blog.id !== _blog.id) newObj.uri += `-${new Date().getTime()}`;
      } catch {}
      blog.uri = newObj.uri;
    }
    if (newObj.title) blog.title = newObj.title;
    if (newObj.shortDescription)
      blog.shortDescription = newObj.shortDescription;
    return await blog.save();
  }

  async deleteBlog(id) {
    if (id) await Blog.destroy({ where: { id } });
  }

  async getBlogByURI(uri) {
    const blog = await Blog.findOne({
      where: {
        uri,
      },
    });
    if (blog) return blog;
    else {
      throw new CustomError("Blog not found", 404);
    }
  }

  async getBlogs(id) {
    const where = {};
    if (id) where.id = id;
    const blogs = await Blog.findAll({ where });
    return blogs;
  }
}

module.exports.BlogService = BlogService;
