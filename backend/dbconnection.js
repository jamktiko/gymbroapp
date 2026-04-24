// imports
const mongoose = require('mongoose');
require('dotenv').config();

// connects to mongodb

const dbconnection = mongoose
  .connect(process.env.MONGODB_ATLAS_URL)
  .then(() => {
    console.log('Database connection successful.');
  })
  .catch((error) => {
    console.log(`Error while connecting to database: ${error}}`);
  });

// export module
module.exports = dbconnection;
