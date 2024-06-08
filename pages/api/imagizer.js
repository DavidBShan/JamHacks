import {imagizer} from '../../lib/openai';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { prompt } = req.body;
            const response = await imagizer(prompt);
            const data = response;
            if (!data) {
                throw new Error("Unable to retrieve summarized text");
            }
            res.status(200).json({ data });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
