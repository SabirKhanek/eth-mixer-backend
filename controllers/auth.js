const { SUDO_PASSWORD } = require("../config");
const { Auth } = require("../services/auth");
const jwt = require("jsonwebtoken");
exports.validateToken = function validateJWT(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }

    // Store the decoded token in the request object for future use
    req.user = decoded;
    next();
  });
};

exports.authenticate = async (req, res) => {
  try {
    if (!req.body.username) return res.apiError("Username not provided", 400);
    if (!req.body.password) return res.apiError("Password not provided", 400);
    const { username, password } = req.body;
    const authService = new Auth();
    try {
      const token = await authService.authenticate(username, password);
      res.send({ jwt: token });
      return;
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode).send(err.message);
    }
  } catch (err) {
    res.status(500).send({ result: "error", message: err.message });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { username, password, sudoKey } = req.body;

    // Validate sudoKey
    if (!sudoKey) return res.status(401).send("Action requires sudo access");

    if (sudoKey !== SUDO_PASSWORD)
      return res.apiError("Sudo password was incorrect", 401);

    // Validate username and password
    if (!username || !password)
      return res
        .status(400)
        .send(`${!username ? "Username" : "Password"} is required`);

    const authService = new Auth();

    try {
      await authService.addUser(username, password);
      res.status(201).send("User added successfully");
      return;
    } catch (err) {
      console.error(err);
      res.status(err.statusCode || 500).send(err.message);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: "error", message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { user } = req.query;
    const authService = new Auth();

    try {
      const users = await authService.getUsers(user);
      res.send(
        users.map((user) => {
          const { username, id, createdAt, updatedAt } = user;
          return { username, id, createdAt, updatedAt };
        })
      );
      return;
    } catch (err) {
      console.error(err);
      res.status(err.statusCode || 500).send(err.message);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: "error", message: err.message });
  }
};

exports.removeUser = async (req, res) => {
  try {
    const { username } = req.params;
    const authService = new Auth();

    try {
      await authService.removeUser(username);
      res.send("User removed successfully");
      return;
    } catch (err) {
      console.error(err);
      res.status(err.statusCode || 500).send(err.message);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: "error", message: err.message });
  }
};
