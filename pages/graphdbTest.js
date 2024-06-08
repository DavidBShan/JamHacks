import { useState } from 'react';
import axios from 'axios';

export default function GetEdgeDescription() {
    const [fromName, setFrom] = useState('');
    const [toName, setTo] = useState('');
    const [description, setDescription] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setDescription(null);
        setError(null);

        try {
            const response = await axios.post('/api/get-edge-description', { fromName, toName });
            const data = response.data;
            setDescription(data.description);
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
            <h1>Get Edge Description</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    From Node:
                    <input
                        type="text"
                        value={fromName}
                        onChange={(e) => setFrom(e.target.value)}
                        required
                    />
                </label>
                <label>
                    To Node:
                    <input
                        type="text"
                        value={toName}
                        onChange={(e) => setTo(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Get Description</button>
            </form>
            {description !== null && (
                <p>Description: {description}</p>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
