import { useState } from 'react';
import styles from '../styles/Home.module.css';
import axios from 'axios';
import Link from 'next/link'

export default function Home() {
    const [currentPage, setCurrentPage] = useState('journal');
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

            try {
                const res = await axios.post('/api/summarize', { prompt: `on ${year}-${month}-${day} ${content}` });
                const jsonString = res.data.data; // Assuming this is a JSON string
                const jsonArray = JSON.parse(jsonString); // Convert JSON string to array

                const bob = 'Bob';

                for (const { name, activity } of jsonArray) {
                    // Check if the node exists for the person
                    const nodeExists = await axios.post('/api/node-exist', { nodeName: name });
                    if (!nodeExists.data.exists) {
                        // Create the node if it doesn't exist
                        await axios.post('/api/add-node', { nodeName: name });
                    }

                    // Check if the relationship exists between Bob and the person
                    const relationshipExists = await axios.post('/api/relationship-exist', { fromNodeName: bob, toNodeName: name });
                    if (!relationshipExists.data.exists) {
                        // Create the relationship if it doesn't exist
                        await axios.post('/api/add-relationships', { fromNodeName: bob, toNodeName: name, description: activity });
                    } else {
                        // Edit the relationship if it exists
                        await axios.post('/api/edit-relationships', { fromNodeName: bob, toNodeName: name, newDescription: activity });
                    }
                }
            } catch (error) {
                console.error("Error creating journal entry or updating graph database", error);
            }
        }
    };

    const handleNavigation = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.usernameSection}>Username</div>
                <Link href="/">Connection</Link>
                <Link href="/graphdbTest">Personal Info</Link>
                <Link href="/journal">Journal</Link>
            </div>
            <div className={styles.content}>
                {currentPage === 'journal' && (
                    <>
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
                    </>
                )}
                {currentPage === 'connection' && (
                    <div>
                        {/* Render Connection Component */}
                        <h1>Connection Page</h1>
                    </div>
                )}
                {currentPage === 'personal-info' && (
                    <div>
                        {/* Render Personal Info Component */}
                        <h1>Personal Info Page</h1>
                    </div>
                )}
            </div>
        </div>
    );
}
