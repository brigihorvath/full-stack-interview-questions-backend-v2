const express = require('express');
const { connectDb, middlewares } = require('./config');
const { PORT } = process.env;

const questionRouter = require('./modules/question');

async function start() {
  try {
    const app = express();

    await connectDb();
    middlewares(app);
    //ROUTERS
    questionRouter(app);
    app.listen(PORT, () => console.log(`Server running at ${PORT}`));
  } catch (err) {
    console.error(`Error at start: ${err.message}`);
  }
}

module.exports = start;
