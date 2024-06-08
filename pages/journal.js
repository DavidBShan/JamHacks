import { useState } from 'react';
import styles from '../styles/journal.module.css';
import axios from 'axios';
import Link from 'next/link'
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
    const [currentPage, setCurrentPage] = useState('journal');
    const { user, error, isLoading } = useUser();
    const user_name = user ? user.name : "Guest"; // Fallback to "Guest" if user is not defined
    const user_picture = user ? user.picture : "/default-profile.png"; 
    const [journalEntries, setJournalEntries] = useState([
        { date: '2024-06-04', title: 'First day of journaling', content: 'Example of a journal entry you could write!' }
    ]);
    const [newEntry, setNewEntry] = useState({ date: '', content: '' });

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

                const name = user_name;

                for (const { name, description } of jsonArray) {
                    const nodeExists = await axios.post('/api/node-exist', { nodeName: name });
                    console.log(nodeExists.data.nodeExists)
                    if (!nodeExists.data.nodeExists) {
                        await axios.post('/api/add-node', { nodeName: name });
                    }
                    const relationshipExists = await axios.post('/api/relationship-exist', { fromNodeName: user_name, toNodeName: name });
                    console.log(relationshipExists.data)
                    if (!relationshipExists.data.relationshipExists) {
                        await axios.post('/api/add-relationships', { fromNodeName: user_name, toNodeName: name, description: description });
                    } else {
                        await axios.post('/api/edit-relationships', { fromNodeName: user_name, toNodeName: name, newDescription: description });
                    }
                }
            } catch (error) {
                console.error("Error creating journal entry or updating graph database", error);
            }
        }
    };

    const handleNavigation = (page) => {
        setCurrentPage(page);
    };// Fallback to a default profile picture

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
