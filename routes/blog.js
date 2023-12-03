const multer = require("multer");
const upload = multer();
const { validateToken } = require("../controllers/auth");
const {
  createBlog,
  getBlogByURI,
  editBlog,
  removeBlog,
  getBlogs,
} = require("../controllers/blog");

const router = require("express").Router();

router.post("/", validateToken, createBlog);
router.get("/:blogUri", getBlogByURI);
router.get("/", getBlogs);
router.put("/", validateToken, upload.none(), editBlog);
router.delete("/:blogId", validateToken, removeBlog);

module.exports.blogsRouter = router;
