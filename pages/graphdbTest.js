import React, { useState } from 'react';
import axios from 'axios';

function EditRelationshipDescriptionForm() {
    const [formData, setFormData] = useState({
        fromNodeName: '',
        toNodeName: '',
        newDescription: ''
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
            const res = await axios.put('/api/edit-relationships', formData);
            setResponse(res.data.message);
        } catch (error) {
            setResponse(error.response ? error.response.data.error : error.message);
        }
    };

    return (
        <div>
            <h2>Edit Relationship Description</h2>
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
                    <label>New Description:</label>
                    <input type="text" name="newDescription" value={formData.newDescription} onChange={handleChange} />
                </div>
                <button type="submit">Edit Relationship Description</button>
            </form>
            {response && <p>{response}</p>}
        </div>
    );
}

export default EditRelationshipDescriptionForm;
