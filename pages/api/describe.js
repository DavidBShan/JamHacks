import {getDescriptorResponse} from '../../lib/openai';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { prompt, name } = req.body;
            console.log(prompt);
            const response = await getDescriptorResponse("Name: " + name + " " + prompt.description);
            console.log(response);
            console.log(response.data[0]?.content);
            const data = response.data[0]?.content[0]?.text?.value;
            if (!data) {
                throw new Error("Unable to retrieve described text");
            }
            console.log(data);
            res.status(200).json({ data });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
