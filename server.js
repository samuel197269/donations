const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const donationsFile = 'donations.json';

// Helper function to save donations
const saveDonation = (donation) => {
    fs.readFile(donationsFile, (err, data) => {
        let donations = [];
        if (!err) {
            donations = JSON.parse(data).donations;
        }
        donations.push(donation);

        fs.writeFile(donationsFile, JSON.stringify({ donations }, null, 2), (err) => {
            if (err) console.error('Error saving donation:', err);
        });
    });
};

// PayPal donation endpoint
app.post('/donate/paypal', async (req, res) => {
    const { amount } = req.body;
    const orderId = uuidv4();

    // Simulating a PayPal transaction ID
    const transactionId = `PAYPAL-${orderId}`;

    const donation = {
        id: orderId,
        donor_name: "Anonymous",
        email: "anonymous@example.com",
        amount,
        currency: "USD",
        payment_method: "PayPal",
        transaction_id: transactionId,
        date: new Date().toISOString()
    };

    saveDonation(donation);

    res.json({ id: transactionId });
});

// Stripe donation endpoint
app.post('/donate/stripe', async (req, res) => {
    const { amount } = req.body;
    const orderId = uuidv4();

    // Simulating a Stripe transaction ID
    const transactionId = `STRIPE-${orderId}`;

    const donation = {
        id: orderId,
        donor_name: "Anonymous",
        email: "anonymous@example.com",
        amount,
        currency: "USD",
        payment_method: "Stripe",
        transaction_id: transactionId,
        date: new Date().toISOString()
    };

    saveDonation(donation);

    res.json({ clientSecret: transactionId });
});

// Endpoint to get all donations
app.get('/donations', (req, res) => {
    fs.readFile(donationsFile, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Could not read donation data' });
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
