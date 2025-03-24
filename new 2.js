const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const stripe = require('stripe')('your-stripe-secret-key');
const paypal = require('@paypal/checkout-server-sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const DonationSchema = new mongoose.Schema({
  amount: Number,
  method: String,
  date: { type: Date, default: Date.now },
});
const Donation = mongoose.model('Donation', DonationSchema);

// Stripe Payment Endpoint
app.post('/donate/stripe', async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PayPal Payment Endpoint
const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET);
const client = new paypal.core.PayPalHttpClient(environment);
app.post('/donate/paypal', async (req, res) => {
  const { amount } = req.body;
  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{ amount: { currency_code: 'USD', value: amount } }],
  });
  try {
    const order = await client.execute(request);
    res.json({ id: order.result.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Store Donations in Database
app.post('/donate/store', async (req, res) => {
  try {
    const newDonation = new Donation(req.body);
    await newDonation.save();
    res.json({ message: 'Donation recorded successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
