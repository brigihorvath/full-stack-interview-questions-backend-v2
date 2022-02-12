const Answer = require('./answer.model');
const Question = require('../question/question.model');
const User = require('../auth/user.model');
const mongoose = require('mongoose');

function isObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

//// CREATE AN ANSWER

async function createAnswer(req, res) {
  const { questionId } = req.query;
  if (!isObjectId(questionId)) console.log(`not object is`);
  try {
    const answer = req.body.content;
    const user = req.session.user;
    console.log(user._id);

    const newAnswer = await Answer.create({
      answer,
      user,
    });
    console.log(newAnswer);
    const newQuestion = await Question.findByIdAndUpdate(
      questionId,
      {
        $push: { answers: newAnswer._id },
      },
      { new: true }
    );
    const newUser = await User.findByIdAndUpdate(
      user._id,
      {
        $push: { answers: newAnswer._id },
      },
      { new: true }
    );
    console.log(newAnswer, newQuestion);
    // console.log(newTour);
    res.status(201).json({
      status: 'success',
      data: {
        content: newAnswer,
      },
    });
  } catch (err) {
    res.status(400).json(err.message).end();
  }
}

module.exports = {
  createAnswer,
};
