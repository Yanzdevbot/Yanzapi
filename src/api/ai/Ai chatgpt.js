const axios = require('axios');
module.exports = function(app) {
    async function fetchFromChatGPT(prompt) {
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo', // atau 'gpt-4' jika kamu punya akses
                    messages: [
                        { role: 'user', content: prompt }
                    ]
                },
                {
                    headers: {
                        'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data.choices[0].message.content;
        } catch (error) {
            console.error("Error fetching content from ChatGPT:", error.response?.data || error.message);
            throw error;
        }
    }

    app.get('/ai/chatgpt', async (req, res) => {
        try {
            const { text } = req.query;
            if (!text) {
                return res.status(400).json({ status: false, error: 'Text is required' });
            }
            const result = await fetchFromChatGPT(text);
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};
