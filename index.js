const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3002;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());
app.use(express.json());

// Define your routes
const listingRoute = require('./routes/listings');
const realtorRoute = require('./routes/realtors');
const userRoute = require('./routes/users');

app.use('/api/listings', listingRoute);
app.use('/api/realtors', realtorRoute);
app.use('/api/users', userRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
