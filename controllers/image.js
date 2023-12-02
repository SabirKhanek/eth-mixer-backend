const { HOST } = require("../config");
const ImageService = require("../services/image");

/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
async function uploadImage(req, res, next) {
  try {
    if (!req.file) return res.apiError("No image provided", 400);
    const title = req.body.title;
    if (!title) return res.apiError("Title is required field", 400);
    const uri = req.body.uri;
    const imageService = new ImageService();
    try {
      const uploadedUri = await imageService.addImage(
        req.file.path,
        title,
        uri
      );
      res.apiSuccess(`${HOST}/images/${uploadedUri}`);
    } catch (err) {
      console.log(err);
      res.apiError(err);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, err });
  }
}

exports.uploadImage = uploadImage;
