// tests/setup.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

// 1. Spin up the in-memory database
exports.connectDB = async () => {
  // Disconnect from any potential existing connections first
  await mongoose.disconnect();

  // Start the memory server
  mongoServer = await MongoMemoryServer.create();

  // Get the temporary, randomly generated connection string
  const uri = mongoServer.getUri();

  // Connect Mongoose to the memory server
  await mongoose.connect(uri);
};

// 2. Clear all data (Run this between every single test)
exports.clearDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

// 3. Shut down the server completely
exports.closeDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();

  if (mongoServer) {
    await mongoServer.stop();
  }
};
