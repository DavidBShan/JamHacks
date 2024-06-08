import { useState } from 'react';
import axios from 'axios';

export default function CheckNode() {
    const [nodeName, setNodeName] = useState('');
    const [nodeExists, setNodeExists] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setNodeExists(null);
        setError(null);

        try {
            const response = await axios.post('/api/node-exist', { nodeName });
            const data = response.data;
            setNodeExists(data.nodeExists);
        } catch (err) {
            if (err.response) {
                setError(err.response.data.error);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <div>
            <h1>Check if Node Exists</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Node Name:
                    <input
                        type="text"
                        value={nodeName}
                        onChange={(e) => setNodeName(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Check</button>
            </form>
            {nodeExists !== null && (
                <p>Node {nodeExists ? 'exists' : 'does not exist'}.</p>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
