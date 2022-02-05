const express = require('express');
const { connectDb, middlewares, sessionConfig } = require('./config');
const { PORT } = process.env;

const questionRouter = require('./modules/question');
const answerRouter = require('./modules/answer');
const authRouter = require('./modules/auth');

async function start() {
  try {
    const app = express();

    await connectDb();
    middlewares(app);
    sessionConfig(app);
    //ROUTERS
    authRouter(app);
    questionRouter(app);
    answerRouter(app);
    app.listen(PORT, () => console.log(`Server running at ${PORT}`));
  } catch (err) {
    console.error(`Error at start: ${err.message}`);
  }
}

module.exports = start;
