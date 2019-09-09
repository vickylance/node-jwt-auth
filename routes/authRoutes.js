const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { validateUserRegister, validateUserLogin } = require('../validations/userValidation');

/**
 * @api {post} /api/v1/register Create a new User
 * @apiName RegisterUser
 * @apiGroup User
 *
 * @apiSuccess {String} user User ID of the User.
 */
router.post('/register', async (req, res) => {
  console.log('Received Request');
  // validating the data before creating the user
  const { error } = validateUserRegister(req.body);
  if (error) { return res.status(400).send(error.details.map((detail) => detail.message)); }
  console.log('Validation Success');

  // checking if the user exists
  const emailExists = await User.findOne({
    email: req.body.email,
  });
  if (emailExists) { return res.status(400).send('Email already Exists'); }
  console.log('New User validated');

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  console.log('Hashing password done');

  // create user data
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  console.log('Built User');

  try {
    // save user in db
    const savedUser = await user.save();
    console.log('Saved User');
    res.send({ user: savedUser._id });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/login', async (req, res) => {
  // validating the data before creating the user
  const { error } = validateUserLogin(req.body);
  if (error) { return res.status(400).send(error.details.map((detail) => detail.message)); }

  // checking if the user exists
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) { return res.status(400).send('Email doesn\'t exists'); }

  // checking if the password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('Invalid Password');

  // create and assign a token
  const token = jwt.sign({ user: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
});

module.exports = router;
