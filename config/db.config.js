const mongoose = require('mongoose');
const { MONGODB_URI } = process.env;

async function connectDb() {
  try {
    const { connection } = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to ${connection.name}`);
  } catch (err) {
    console.log(`Error in mongoose connection: ${err.message}`);
  }
}

module.exports = connectDb;
