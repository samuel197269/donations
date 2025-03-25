const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Import routes
const donationRoutes = require('./routes/donations');
const chatRoutes = require('./routes/chat');

app.use('/donate', donationRoutes);
app.use('/chat', chatRoutes);

app.get('/', (req, res) => {
    res.send('Donation API is running.');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
