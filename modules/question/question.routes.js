const controllers = require('./question.controllers');
const ROUTES = require('./question.constants');
const express = require('express');

function questionRouter(app) {
  const router = express.Router();

  router
    .get(ROUTES.getQuestions, controllers.getQuestions)
    .get(ROUTES.getFavourites, controllers.getFavourites)
    .get(ROUTES.getQuestionById, controllers.getQuestionById)
    .get(ROUTES.getQuestionsByCategory, controllers.getQuestionsByCategory)
    .get(ROUTES.getRandomQuestion, controllers.getRandomQuestion)
    .post(ROUTES.createQuestion, controllers.createQuestion)
    .post(ROUTES.addToFavourites, controllers.addToFavourites)
    .post(ROUTES.removeFromFavourites, controllers.removeFromFavourites)
    .post(ROUTES.deleteQuestion, controllers.deleteQuestion);

  app.use('/api', router);
}

module.exports = questionRouter;
