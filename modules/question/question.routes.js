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
    .post(ROUTES.createQuestion, controllers.createQuestion)
    .post(ROUTES.addToFavourites, controllers.addToFavourites);

  app.use('/api', router);
}

module.exports = questionRouter;
