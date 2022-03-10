const Question = require('./question.model');
const User = require('../auth/user.model');
const Answer = require('../answer/answer.model');
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

async function removeFromFavourites(req, res) {
  const { questionId } = req.body;
  try {
    const newQuestion = await Question.findByIdAndUpdate(questionId, {
      $inc: { likes: -1 },
    });
    const newUser = await User.findByIdAndUpdate(req.session.user._id, {
      $pull: { favourites: newQuestion._id },
    });
    // console.log(newQuestion);
    res.status(201).json({ status: 'success', data: { content: newQuestion } });
  } catch (err) {
    res.status(400).json(err.message).end();
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

async function deleteQuestion(req, res) {
  const { questionId } = req.params;
  try {
    console.log(questionId);
    // delete the answers from the users
    const data = await Question.findById(questionId).select('answers');
    // console.log('answers:', data.answers);

    // delete answers from upvoted/downvoted
    await User.updateMany(
      { upVotedAnswers: { $in: data?.answers } },
      {
        $pull: { upVotedAnswers: { $in: data?.answers } },
      },
      { new: true }
    );

    await User.updateMany(
      { downVotedAnswers: { $in: data?.answers } },
      {
        $pull: { downVotedAnswers: { $in: data?.answers } },
      },
      { new: true }
    );

    await User.updateMany(
      { answers: { $in: data?.answers } },
      {
        $pull: { answers: { $in: data?.answers } },
      },
      { new: true }
    );

    // delete all the answers for the question
    await Answer.deleteMany({ _id: { $in: data?.answers } });
    // delete question from answered questions
    await User.updateMany(
      { answeredQuestions: questionId },
      {
        $pull: { answeredQuestions: questionId },
      },
      { new: true }
    );
    // delete question from favourites
    await User.updateMany(
      { favourites: questionId },
      {
        $pull: { favourites: questionId },
      },
      { new: true }
    );
    // delete the question from the user
    await User.findOneAndUpdate(
      { questions: questionId },
      {
        $pull: { questions: questionId },
      },
      { new: true }
    );
    // delete Question

    await Question.findByIdAndDelete(questionId);
    res.status(200).json({ status: 'success', data: { content: data } });
  } catch (err) {
    console.log(err);
    res.status(400).json(err.message).end();
  }
}

async function getRandomQuestion(req, res) {
  try {
    const allQuestions = await Question.find().populate('answers').lean();
    const randomNumId = Math.floor(Math.random() * allQuestions.length);
    const randomQuestion = allQuestions[randomNumId];
    console.log(randomNumId);
    res.status(200).json(randomQuestion).end();
  } catch (err) {
    res.status(400).json(err.message).end();
    // console.log('Error in backend');
  }
}

module.exports = {
  getQuestions,
  getQuestionById,
  getQuestionsByCategory,
  createQuestion,
  addToFavourites,
  getFavourites,
  removeFromFavourites,
  deleteQuestion,
  getRandomQuestion,
};
