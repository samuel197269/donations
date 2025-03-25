const express = require('express');
const router = express.Router();

let messages = [];

router.post('/send', (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message cannot be empty' });

    messages.push(message);
    res.json({ success: true, messages });
});

router.get('/messages', (req, res) => {
    res.json({ messages });
});

module.exports = router;
