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

router.get("/me", async (req, res, next) => {
  try {
    console.log('session:', req.session)
    if (!req.session.test) req.session.test = 1
    else ++req.session.test
    console.log('GET ME TEST:', req.session.test)
    const user = await User.findByPk(req.session.userId)
    res.json(user || {})
  } catch (error) {
    next(error)
  }
})

// router.post("/test", (req, res, next) => {
//   if (!req.session.test) req.session.test = 1
//   else ++req.session.test
//   console.log('POST TEST TEST:', req.session.test)
//   res.end()
// })

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
      req.session.userId = newUser.id
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
    // console.log('session before attatching:', req.session)
    const {username, password} = req.body;
    // console.log(req.body);
    const user = await User.findOne({
      where: {
        username
      }
    });
    if(user.correctPassword(password)){
      req.session.userId = user.id
      // console.log('attaching id to user:', req.session)
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

router.delete("/", async (req, res, next) => {
  try {
    const { userId } = req.session;
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
