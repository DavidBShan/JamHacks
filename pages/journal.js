import { useState } from 'react';
import styles from '../styles/Home.module.css';
import axios from 'axios';

export default function Home() {
    const [journalEntries, setJournalEntries] = useState([]);
    const [newEntry, setNewEntry] = useState({ year: '', month: '', day: '', content: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEntry({ ...newEntry, [name]: value });
    };

    const handleCreateEntry = async () => {
        const { year, month, day, content } = newEntry;
        if (year && month && day && content) {
            setJournalEntries([...journalEntries, { date: `${year}-${month}-${day}`, content }]);
            setNewEntry({ year: '', month: '', day: '', content: '' });

            const res = await axios.post('/api/summarize', { prompt: "on " + year + "-" + month + "-" + day + " " + content });
            const jsonString = res.data.data; // Assuming this is a JSON string
            const jsonArray = JSON.parse(jsonString);
            console.log(jsonArray);

            const bob = 'Bob';

            for (const { name, activity } of jsonArray) {
                // Check if the node exists for the person
                let nodeExists = await axios.post('/api/node-exist', { nodeName: name });
                console.log(nodeExists);
                if (!nodeExists.data.exists) {
                    // Create the node if it doesn't exist
                    await axios.post('/api/add-node', { nodeName: name });
                }

                // Check if the relationship exists between Bob and the person
                let relationshipExists = await axios.post('/api/relationship-exist', { fromNodeName: bob, toNodeName: name });
                console.log(relationshipExists);
                if (!relationshipExists.data.exists) {
                    // Create the relationship if it doesn't exist
                    await axios.post('/api/add-relationships', { fromNodeName: bob, toNodeName: name, description: activity });
                } else {
                    // Edit the relationship if it exists
                    await axios.post('/api/edit-relationships', { fromNodeName: bob, toNodeName: name, newDescription: activity });
                }
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.usernameSection}>Username</div>
                <button className={styles.sidebarButton}>Connection</button>
                <button className={styles.sidebarButton}>Personal Info</button>
                <button className={styles.sidebarButton}>Journal</button>
            </div>
            <div className={styles.content}>
                {journalEntries.map((entry, index) => (
                    <div className={styles.journalEntry} key={index}>
                        <h2>{entry.date}</h2>
                        <p>{entry.content}</p>
                    </div>
                ))}
                <div className={styles.newEntry}>
                    <h3>Start Journaling</h3>
                    <input
                        type="text"
                        name="year"
                        placeholder="Year"
                        value={newEntry.year}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="month"
                        placeholder="Month"
                        value={newEntry.month}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="day"
                        placeholder="Day"
                        value={newEntry.day}
                        onChange={handleInputChange}
                    />
                    <textarea
                        name="content"
                        placeholder="Journal Here"
                        value={newEntry.content}
                        onChange={handleInputChange}
                    />
                    <button onClick={handleCreateEntry}>Create</button>
                </div>
            </div>
        </div>
    );
}
