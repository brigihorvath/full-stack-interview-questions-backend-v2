const User = require('./user.model');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

function validationError(error) {
  return error instanceof mongoose.Error.ValidationError;
}

function isMongoError(error) {
  return error.code === 11000;
}

const emailRegex = /^\S+@\S+\.\S+$/;
const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

function hasWrongFormat(email, password) {
  return !emailRegex.test(email) || !passwordRegex.test(password);
}

async function signup(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    if (hasWrongFormat(email, password)) {
      return res
        .status(400)
        .json({ message: 'Email or password is incorrect' });
    }

    const hasUser = await User.findOne({ email }).lean();

    if (hasUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salRounds = 10;
    const salt = await bcrypt.genSalt(salRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      email,
      password: hashedPassword,
      answers: [],
      questions: [],
      favourites: [],
      points: 0,
    });
    console.log(user);
    const userWithoutPass = { email: user.email, _id: user._id };

    console.log(req.session);
    req.session.user = userWithoutPass;

    return res.status(200).json(userWithoutPass);
  } catch (error) {
    if (validationError(error)) {
      return res.status(400).json({ message: error.message });
    }
    if (isMongoError(error)) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).lean();

    if (!user) {
      return res.status(400).json({ message: 'User not found, please signup' });
    }

    const hasCorrectPassword = await bcrypt.compare(password, user.password);
    if (hasCorrectPassword) {
      const userWithoutPass = { email: user.email, _id: user._id };
      req.session.user = userWithoutPass;
      return res.status(200).json(userWithoutPass);
    }

    return res.status(400).json({ message: 'wrong passwords' });
  } catch (error) {
    if (validationError(error)) {
      return res.status(400).json({ message: error.message });
    }
    if (isMongoError(error)) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
}

async function logout(req, res) {
  try {
    await req.session.destroy();
    return res.status(200).json({ message: 'logout' });
  } catch (err) {
    res.status(500).json({ error: err.messages });
  }
}

async function getLoggedInUser(req, res) {
  try {
    const user = req.session.user;
    if (!user) {
      return res.status(400).json(null);
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.messages });
  }
}

async function getUserDetails(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate('favourites')
      .populate('questions')
      .lean();
    const detailedUser = { ...user, password: null };
    res.status(200).json(detailedUser);
  } catch (error) {
    res.status(500).json({ error: error.messages });
  }
}

async function updateUser(req, res) {
  const { username, email } = req.body;
  try {
    const user = req.session.user;
    if (!user) {
      return res.status(400).json(null);
    }
    const newUser = await User.findByIdAndUpdate(
      user._id,
      { username, email },
      { new: true }
    )
      .populate('favourites')
      .populate('questions')
      .lean();
    const userWithoutPass = {
      email: newUser.email,
      _id: newUser._id,
      favourites: newUser.favourites,
      questions: newUser.questions,
      answers: newUser.answers,
      username: newUser.username,
      answeredQuestions: newUser.answeredQuestions,
    };
    res.status(201).json(userWithoutPass);
  } catch (error) {
    res.status(500).json({ error: error.messages });
  }
}

module.exports = {
  signup,
  login,
  logout,
  getLoggedInUser,
  getUserDetails,
  updateUser,
};
