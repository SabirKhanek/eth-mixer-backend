const { User, sequelize } = require("../database");
const jwt = require("jsonwebtoken");
const { CustomError } = require("../utils/errors");
const { JWT_SECRET } = require("../config");

class Auth {
  async authenticate(username, password) {
    const user = await User.findOne({
      where: {
        username: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("username")),
          "LIKE",
          "%" + username + "%"
        ),
      },
    });
    if (!user) throw new CustomError("User not found", 401);

    const passwordInDb = user.password;
    if (password !== passwordInDb)
      throw new CustomError("Password incorrect", 401);

    if (!JWT_SECRET) throw new CustomError(500, "Private key not set");
    const token = jwt.sign({ username }, JWT_SECRET);

    return token;
  }

  async addUser(username, password) {
    // Check if the user already exists
    const existingUser = await User.findOne({
      where: {
        username: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("username")),
          "LIKE",
          "%" + username + "%"
        ),
      },
    });

    if (existingUser) {
      // User already exists, change the password
      existingUser.password = password;
      await existingUser.save();
    } else {
      // User doesn't exist, create a new user
      await User.create({ username, password });
    }
  }

  async getUsers(user) {
    if (user) {
      // If user is provided, return that user
      const foundUser = await User.findOne({
        where: {
          username: sequelize.where(
            sequelize.fn("LOWER", sequelize.col("username")),
            "LIKE",
            "%" + user + "%"
          ),
        },
      });

      if (!foundUser) {
        throw new CustomError("User not found", 404);
      }

      return [foundUser];
    } else {
      // If no user is provided, return all users
      const allUsers = await User.findAll();
      return allUsers;
    }
  }

  async removeUser(username) {
    // Find the user
    const userToDelete = await User.findOne({
      where: {
        username: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("username")),
          "LIKE",
          "%" + username + "%"
        ),
      },
    });

    if (!userToDelete) {
      throw new CustomError("User not found", 404);
    }

    // Remove the user
    await userToDelete.destroy();
  }
}

exports.Auth = Auth;
