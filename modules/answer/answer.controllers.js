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
      votes: 0,
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

async function upvoteAnswer(req, res) {
  const { answerId } = req.params;
  if (!isObjectId(answerId))
    console.log(`answerId is not objectId - upvoteAnswer`);
  const { user } = req.session;

  try {
    const newUser = await User.findById(user._id);
    // console.log('newUser: ', newUser);
    let updatedUser;
    if (newUser.upVotedAnswers?.includes(answerId)) {
      throw new Error('You have already upvoted this answer');
    } else if (newUser.downVotedAnswers?.includes(answerId)) {
      updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          $pull: { downVotedAnswers: answerId },
        },
        { new: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          $push: { upVotedAnswers: answerId },
        },
        { new: true }
      );
    }
    const newAnswer = await Answer.findByIdAndUpdate(
      answerId,
      {
        $inc: { votes: 1 },
      },
      { new: true }
    );
    res.status(201).json({
      status: 'success',
      data: {
        content: newAnswer,
      },
    });
    // console.log('updatedUser: ', updatedUser);
    // console.log('newAnswer: ', newAnswer);
  } catch (error) {
    console.log('line77: ', error);
    res.status(400).json(error.message).end();
  }
  // console.log(answerId);
}
async function downvoteAnswer(req, res) {
  const { answerId } = req.params;
  if (!isObjectId(answerId)) console.log(`answerId is not objectId`);
  const { user } = req.session;

  try {
    const newUser = await User.findById(user._id);
    // console.log('newUser: ', newUser);
    let updatedUser;
    if (newUser.downVotedAnswers?.includes(answerId)) {
      throw new Error('You have already downvoted this answer');
    } else if (newUser.upVotedAnswers?.includes(answerId)) {
      updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          $pull: { upVotedAnswers: answerId },
        },
        { new: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          $push: { downVotedAnswers: answerId },
        },
        { new: true }
      );
    }
    const newAnswer = await Answer.findByIdAndUpdate(
      answerId,
      {
        $inc: { votes: -1 },
      },
      { new: true }
    );

    res.status(201).json({
      status: 'success',
      data: {
        content: newAnswer,
      },
    });
    // console.log('updatedUser: ', updatedUser);
    // console.log('newAnswer: ', newAnswer);
  } catch (error) {
    console.log('line77: ', error);
    res.status(400).json(error.message).end();
  }
  // console.log(answerId);
}

module.exports = {
  createAnswer,
  upvoteAnswer,
  downvoteAnswer,
};
