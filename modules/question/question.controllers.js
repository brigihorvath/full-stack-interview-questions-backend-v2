const Question = require('./question.model');
const User = require('../auth/user.model');
const mongoose = require('mongoose');

function isObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

//// GET ALL QUESTIONS

async function getQuestions(req, res) {
  //   console.log(req.session.user);

  try {
    const allQuestions = await Question.find().populate('user').lean();
    res.status(200).json(allQuestions).end();
  } catch (err) {
    res.status(400).json(err.message).end();
    // console.log('Error in backend');
  }
}

///// GET ONE QUESTION BY ID
async function getQuestionById(req, res) {
  const { questionId } = req.params;
  if (!isObjectId(questionId)) {
    res.status(400).json('Id not valid').end();
  }
  //   console.log(questionId);
  try {
    const question = await Question.findById(questionId).populate('answers');
    res.status(200).json(question);
  } catch (err) {
    // console.log('Error in backend');
    res.status(400).json(err);
  }
}

//// GET QUESTIONS BY CATEGORY

async function getQuestionsByCategory(req, res) {
  try {
    const { category } = req.params;
    const questionsByCategory = await Question.find({ category: category });
    res.status(200).json(questionsByCategory);
  } catch (err) {
    res.status(400).json(err);
  }
}

//// CREATE A QUESTION

async function createQuestion(req, res) {
  try {
    const question = req.body.content;
    const answers = [];
    const likes = 0;
    const category = req.body.category;
    const user = req.session.user._id;

    const newQuestion = await Question.create({
      question,
      answers,
      likes,
      category,
      user,
    });

    const newUser = await User.findByIdAndUpdate(
      user,
      {
        $push: { questions: newQuestion._id },
      },
      { new: true }
    );
    console.log('newUser', newUser);

    res.status(201).json({
      status: 'success',
      data: {
        content: newQuestion,
      },
    });
  } catch (err) {
    res.status(400).json(err.message).end();
    console.log(
      'Error message:',
      err.message,
      'Session user : ',
      req.session.user
    );
  }
}

async function addToFavourites(req, res) {
  const { questionId } = req.body;
  try {
    const newQuestion = await Question.findByIdAndUpdate(questionId, {
      $inc: { likes: 1 },
    });
    const newUser = await User.findByIdAndUpdate(req.session.user._id, {
      $push: { favourites: newQuestion._id },
    });
    // console.log(newQuestion);
    res.status(201).json({ status: 'success', data: { content: newQuestion } });
  } catch (err) {
    res.status(400).json(err.message).end();
  }
}

async function getFavourites(req, res) {
  try {
    // console.log('userId:', userId);
    const user = await User.findById(req.session.user._id).select('favourites');
    // console.log('getFav:', user);
    res.status(201).json({ status: 'success', data: { content: user } });
  } catch (err) {
    res.status(400).json(err.message).end();
  }
}

module.exports = {
  getQuestions,
  getQuestionById,
  getQuestionsByCategory,
  createQuestion,
  addToFavourites,
  getFavourites,
};
