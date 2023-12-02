const fs = require("fs").promises;
const path = require("path");
const { Image } = require("../database");
const { CustomError } = require("../utils/errors");
const { STORAGE_MOUNT } = require("../config");

class ImageService {
  /**
   *
   * @param {string} uploadImagePath
   * @param {string} title
   * @param {string} uri
   */
  async addImage(uploadImagePath, title, uri) {
    try {
      // If URI is not provided, generate one based on title and uploadImagePath
      if (!uri) {
        const extension = path.extname(uploadImagePath);
        const baseName = path.basename(uploadImagePath, extension);
        uri = `${title.replace(/\s+/g, "-")}-${baseName}${extension}`;
      }

      // Check if an image with the same title already exists
      const existingImage = await Image.findOne({ where: { title } });
      if (existingImage) {
        throw new CustomError("Image with the same title already exists", 409);
      }

      // Check if the file exists at uploadImagePath
      try {
        await fs.access(uploadImagePath);
      } catch (error) {
        throw new CustomError(`No file found at ${uploadImagePath}`, 404);
      }

      // Define the destination path where the image will be saved
      let destinationPath = path.join(STORAGE_MOUNT, "images", uri);

      // Check if the destination path already exists, and if so, append a unique value

      let counter = 1;
      while (
        await (async () => {
          try {
            await fs.access(destinationPath);
            return true;
          } catch {
            return false;
          }
        })()
      ) {
        const extension = path.extname(uploadImagePath);
        uri = `${title.replace(/\s+/g, "-")}-${counter}${extension}`;
        destinationPath = path.join(STORAGE_MOUNT, "images", uri);
        counter++;
      }

      // Create the destination directory if it doesn't exist
      await fs.mkdir(path.dirname(destinationPath), { recursive: true });

      // Copy the image to the destination path
      await fs.copyFile(uploadImagePath, destinationPath);

      // Create a record in the database
      const newImage = await Image.create({
        title,
        uri,
        physical_path: destinationPath,
      });

      try {
        await fs.unlink(uploadImagePath);
      } catch (err) {}

      // Return the final URI with the file extension
      return `${uri}`;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ImageService;
