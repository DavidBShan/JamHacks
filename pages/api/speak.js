import {speak} from '../../lib/openai';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { prompt } = req.body;
            const response = await speak(prompt);
            console.log(response);
            res.status(200).json({ response });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
