// pages/api/generateText.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { prompt } = req.body;
            const apiKey = process.env.OPENAI_API_KEY; // Your GPT-3.5 Turbo API Key
            const response = await axios.post(
                'https://api.openai.com/v1/completions',
                {
                    model: 'gpt-3.5-turbo', // Adjust this based on your GPT model
                    prompt: prompt,
                    max_tokens: 100,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                }
            );

            const { data } = response;
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
