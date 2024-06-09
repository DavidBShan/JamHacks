import {getDescriptorResponse} from '../../lib/openai';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { prompt, name } = req.body;
            const response = await getDescriptorResponse("Name: " + name + " " + prompt.description);
            console.log(response)
            const data = response.data[0]?.content[0]?.text?.value;
            if (!data) {
                throw new Error("Unable to retrieve described text");
            }
            res.status(200).json({ data });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
