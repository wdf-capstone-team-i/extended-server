const router = require("express").Router();
const { User } = require("../../db");

// Get all users
router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();

    res.json(users);
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    // might need to user the order or add something
    const { firstname, lastname, username, email, password } = req.body;

    const newUser = await User.create({
      firstname,
      lastname,
      username,
      email,
      password,
    });

    if (newUser) {
      res.status(201).json(newUser);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next)=> {
  try{
    const {username, password} = req.body;
    console.log(req.body);
    const user = await User.findOne({
      where: {
        username
      }
    });

    if(user.correctPassword(password)){
      res.json(user);
    }else{
      res.send('User is not found.');
    }
  }catch(err){
    next(err)
  }
})

// Get one user
router.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.sendStatus(404);
    }
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

module.exports = router;
