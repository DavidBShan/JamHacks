import { useState } from 'react';
import styles from '../styles/journal.module.css';
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
    const [journalEntries, setJournalEntries] = useState([
        { date: '2024-06-04', title: 'First day of journaling', content: 'Example of a journal entry you could write!' }
    ]);
    const [newEntry, setNewEntry] = useState({ date: '', content: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEntry({ ...newEntry, [name]: value });
    };

    const handleCreateEntry = () => {
        const { date, content } = newEntry;
        if (date && content) {
            setJournalEntries([...journalEntries, { date, content }]);
            setNewEntry({ date: '', content: '' });
        }
    };

    const { user, error, isLoading } = useUser();
    const user_name = user ? user.name : "Guest"; // Fallback to "Guest" if user is not defined
    const user_picture = user ? user.picture : "/default-profile.png"; // Fallback to a default profile picture

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>

                <div className={styles.usernameSection}>
                    {user_name}
                    <img src={user_picture} alt="Profile" className={styles.profilePicture} />
                </div>
                <button className={styles.sidebarButton}>Connection</button>
                <button className={styles.sidebarButton}>Personal Info</button>
                <button className={styles.sidebarButton}>Journal</button>
            </div>
            <div className={styles.content}>
                {journalEntries.map((entry, index) => (
                    <div className={styles.journalEntry} key={index}>
                        <h2 className={styles.journalEntryDate} >{entry.date}</h2>
                        <h3>{entry.title}</h3>
                        <p>{entry.content}</p>
                    </div>
                ))}
                <div className={styles.newEntryContainer}>
                    <div className={styles.newEntry}>
                        <h2 className={styles.journalEntryTopTitle}>Start Journaling</h2>
                        <input
                            type="date"
                            name="date"
                            value={newEntry.date}
                            onChange={handleInputChange}
                            className={styles.dateInput}
                        />
                        <textarea
                            name="content"
                            placeholder="Start recording down your memory!"
                            value={newEntry.content}
                            onChange={handleInputChange}
                            className={styles.textInput}
                        />
                        <button onClick={handleCreateEntry} className={styles.createButton}>Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
