const router = require("express").Router();

// Get all users
router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();

    res.json(users);
  } catch (error) {
    next(error);
  }
});
