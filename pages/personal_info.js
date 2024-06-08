import { useState } from 'react';
import styles from '../styles/personal_info.module.css';

export default function Home() {
    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.usernameSection}>Username</div>
                <button className={styles.sidebarButton}>Connection</button>
                <button className={styles.sidebarButton}>Personal Info</button>
                <button className={styles.sidebarButton}>Journal</button>
            </div>
            <div className={styles.content}>
                <h3>Hi! My name is..</h3>
                        
            </div>
        </div>

    );
}
