import { useState } from 'react';
import styles from '../styles/personal_info.module.css';
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {

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
                <h3>Hi! My name is..</h3>

            </div>
        </div>

    );
}
