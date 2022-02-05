const controllers = require('./answer.controllers');
const ROUTES = require('./answer.constants');
const express = require('express');

function answerRouter(app) {
  const router = express.Router();

  router.post(ROUTES.createAnswer, controllers.createAnswer);

  app.use('/api', router);
}

module.exports = answerRouter;
