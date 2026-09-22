const mongoose = require('mongoose');

// Note: the DNS_SERVERS override (for routers that reject mongodb+srv:// SRV
// lookups) is applied in src/index.js, before this module or ./app is
// required — connect-mongo's session store also opens a MongoDB connection
// at require time, so the override has to run before both.
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set in the environment');
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
};

module.exports = connectDB;
