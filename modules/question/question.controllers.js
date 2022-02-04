const Question = require('./question.model');
const mongoose = require('mongoose');

function isObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

//// GET ALL QUESTIONS

async function getQuestions(req, res) {
  console.log('itt');
  try {
    const allQuestions = await Question.find().lean();
    res.status(200).json(allQuestions);
  } catch (err) {
    res.status(400).json(err.message).end();
    console.log('Error in backend');
  }
}

///// GET ONE QUESTION BY ID
async function getQuestionById(req, res) {
  const { questionId } = req.params;
  if (!isObjectId(questionId)) {
    res.status(400).json('Id not valid').end();
  }
  console.log(questionId);
  try {
    const question = await Question.findOne({ _id: questionId })
      //   .populate('answers')
      .lean();
    res.status(200).json(question);
  } catch (err) {
    console.log('Error in backend');
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
    const answers = '';
    const likes = 0;
    const category = 'JavaScript';

    const newQuestion = await Question.create({
      question,
      answers,
      likes,
      category,
    });
    // console.log(newTour);
    res.status(201).json({
      status: 'success',
      data: {
        content: newQuestion,
      },
    });
  } catch (err) {
    res.status(400).json(err.message).end();
    console.log(err.message);
  }
}

module.exports = {
  getQuestions,
  getQuestionById,
  getQuestionsByCategory,
  createQuestion,
};
