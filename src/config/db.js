const dns = require('dns');
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set in the environment');
  }

  // Some local routers refuse the SRV lookups Node makes for mongodb+srv:// URIs.
  if (process.env.DNS_SERVERS) {
    dns.setServers(process.env.DNS_SERVERS.split(',').map((s) => s.trim()));
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
};

module.exports = connectDB;
