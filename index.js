// index.js
const express = require('express');
const Groq = require('groq-sdk'); // Hypothetical SDK

const app = express();
const port = 3000;
const groqApiKey = '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'; // Replace with your actual API key

const groq = new Groq({ apiKey: groqApiKey });
let chatHistory = [];

// Serve static files from the "public" directory
app.use(express.static('public'));

// Endpoint to handle chat requests
app.get('/llama3', async (req, res) => {
    const prompt = req.query.prompt;
    if (!prompt) {
        return res.status(400).send('Prompt query parameter is required');
    }

    try {
        // Call the Groq API
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama3-8b-8192'
        });

        // Get the assistant's response
        const assistantMessage = chatCompletion.choices[0]?.message?.content || '';

        // Save the messages to the chat history
        chatHistory.push({ role: 'user', content: prompt });
        chatHistory.push({ role: 'assistant', content: assistantMessage });

        // Send back the response
        res.json({ response: assistantMessage });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating response from Groq API');
    }
});

// Endpoint to get chat history
app.get('/history', (req, res) => {
    res.json(chatHistory);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
