require('dotenv').config();

// Must run before anything that opens a MongoDB connection (including
// connect-mongo's session store, set up inside ./app at require time) — some
// local routers reject the SRV lookups Node makes for mongodb+srv:// URIs.
const dns = require('dns');
if (process.env.DNS_SERVERS) {
  dns.setServers(process.env.DNS_SERVERS.split(',').map((s) => s.trim()));
}

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
