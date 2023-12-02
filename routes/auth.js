const {
  authenticate,
  validateToken,
  addUser,
  getUsers,
  removeUser,
} = require("../controllers/auth");

const router = require("express").Router();
// Authentication route
router.post("/authenticate", authenticate);

// Validate token route
router.post("/validate", validateToken, (req, res) => {
  res.send({ result: "ok" });
});

// Add user route
router.post("/addUser", validateToken, addUser);

// Get users route
router.get("/getUsers", validateToken, getUsers);

// Remove user route
router.delete("/removeUser/:username", validateToken, removeUser);

module.exports.authRouter = router;
