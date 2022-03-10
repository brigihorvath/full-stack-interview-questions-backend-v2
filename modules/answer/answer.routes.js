const controllers = require('./answer.controllers');
const ROUTES = require('./answer.constants');
const express = require('express');

function answerRouter(app) {
  const router = express.Router();

  router
    .post(ROUTES.createAnswer, controllers.createAnswer)
    .post(ROUTES.upvoteAnswer, controllers.upvoteAnswer)
    .post(ROUTES.downvoteAnswer, controllers.downvoteAnswer);
  app.use('/api', router);
}

module.exports = answerRouter;
