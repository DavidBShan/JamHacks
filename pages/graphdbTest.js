import React, { useState } from 'react';
import axios from 'axios';

function CreateRelationshipForm() {
    const [formData, setFormData] = useState({
        fromNodeName: '',
        toNodeName: '',
        description: ''
    });
    const [response, setResponse] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/add-relationships', formData);
            setResponse(res.data.message);
        } catch (error) {
            setResponse(error.response ? error.response.data.error : error.message);
        }
    };

    return (
        <div>
            <h2>Create Relationship</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>From Node Name:</label>
                    <input type="text" name="fromNodeName" value={formData.fromNodeName} onChange={handleChange} />
                </div>
                <div>
                    <label>To Node Name:</label>
                    <input type="text" name="toNodeName" value={formData.toNodeName} onChange={handleChange} />
                </div>
                <div>
                    <label>Description:</label>
                    <input type="text" name="description" value={formData.description} onChange={handleChange} />
                </div>
                <button type="submit">Create Relationship</button>
            </form>
            {response && <p>{response}</p>}
        </div>
    );
}

export default CreateRelationshipForm;
