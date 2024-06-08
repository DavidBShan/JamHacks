// pages/api/upload.js

import nextConnect from 'next-connect'; // Import next-connect

const handler = nextConnect({
    onError(error, req, res) {
        res.status(501).json({ error: `Something went wrong! ${error.message}` });
    },
});

handler.post(async (req, res) => {
    try {
        const { file, filename } = req.body;
        // Your file upload logic here
        res.status(200).json({ url: `/uploads/${filename}` });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

export default handler;
