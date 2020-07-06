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

// Get one user
router.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (user) {
      res.status(200).json(user);
    } else sendStatus(404);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    // might need to user the order or add something
    const { firstName, lastName, username, email, password } = req.body;

    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      password,
    });

    if (newUser) {
      res.status(200).json(newUser);
    } else sendStatus(404);
  } catch (error) {
    next(error);
  }
});

router.delete("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    await User.destroy({
      where: {
        id: userId,
      },
    });

    res.status(204).json("user deleted");
  } catch (error) {
    next(error);
  }
});
