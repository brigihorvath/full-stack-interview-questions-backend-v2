const { Schema, model } = require('mongoose');

const QuestionSchema = new Schema({
  question: {
    type: Object,
    required: [true, 'Please provide a tour name'],
    trim: true,
  },
  answers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Answer',
    },
  ],
  // answers: [{
  //   type: String,
  //   default: '',
  // },
  likes: {
    type: Number,
    default: 0,
  },
  category: [
    {
      type: String,
      enum: [
        'Basics',
        'OOP',
        'Closures',
        'DOM',
        'Arrays',
        'Strings',
        'Promises',
        'JavaScript',
      ],
      default: 'JavaScript',
    },
  ],
  // user: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = model('Question', QuestionSchema);
