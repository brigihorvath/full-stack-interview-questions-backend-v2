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
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  points: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('User', userSchema);
