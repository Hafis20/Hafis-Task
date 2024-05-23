const express = require('express');
const app = express();

// Environment file info
const dotenv = require('dotenv');
dotenv.config(); // Initialized enviroment config

// Database Details
const DB_USER = process.env['DB_USER'];
const DB_PWD = process.env['DB_PWD'];
const DB_URL = process.env['MONGO_URL'];

const mongoose = require('mongoose');
mongoose
  .connect(DB_URL)
  .then(() => console.log('DB Connected Successfully'))
  .catch((err) => console.log(err.message));

// Port configuration
const PORT = process.env['PORT'] || 5000;

// JSON Data parsing
app.use(express.json());

// Routing
const router = require('./routers/router');

// Endpoints
app.use('/api', router);


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

