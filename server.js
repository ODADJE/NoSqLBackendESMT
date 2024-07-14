require('dotenv').config();
const app = require('./app');
const dbConfig = require('./config/db.config');

// Connect to MongoDB
dbConfig();

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`The server is listening on :localhost:${PORT}/`);
});
