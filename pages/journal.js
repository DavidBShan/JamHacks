import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
    const [journalEntries, setJournalEntries] = useState([
        { date: '2024-06-04', content: 'SWAP WITH CONTENT' }
    ]);
    const [newEntry, setNewEntry] = useState({ year: '', month: '', day: '', content: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEntry({ ...newEntry, [name]: value });
    };

    const handleCreateEntry = () => {
        const { year, month, day, content } = newEntry;
        if (year && month && day && content) {
            setJournalEntries([...journalEntries, { date: `${year}-${month}-${day}`, content }]);
            setNewEntry({ year: '', month: '', day: '', content: '' });
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
