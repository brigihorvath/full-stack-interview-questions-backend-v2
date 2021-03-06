const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    default: 'Ironhacker',
  },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  answeredQuestions: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  ],
  points: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  upVotedAnswers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
  downVotedAnswers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
});

module.exports = mongoose.model('User', userSchema);
