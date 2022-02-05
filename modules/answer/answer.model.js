const { Schema, model } = require('mongoose');

const AnswerSchema = new Schema({
  answer: {
    type: Object,
    trim: true,
  },
  //   upvotes: {
  //     type: Number,
  //     default: 0,
  //   },
  //   downvotes: {
  //     type: Number,
  //     default: 0,
  //   },
  // user: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = model('Answer', AnswerSchema);
