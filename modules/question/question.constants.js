module.exports = {
  getQuestions: '/questions',
  getQuestionById: '/questions/:questionId',
  getQuestionsByCategory: '/questions/categories/:category',
  getRandomQuestion: '/random-question',
  createQuestion: '/questions/create-question',
  getFavourites: '/questions/favourites',
  updateQuestion: '/questions/:questionId',
  deleteQuestion: '/questions/:questionId',
  addToFavourites: '/questions/favourites',
  removeFromFavourites: '/questions/removeFavourites',
  deleteQuestion: '/questions/delete/:questionId',
};
