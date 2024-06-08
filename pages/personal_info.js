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
                <div className={styles.infoSection}>
                    <div className={styles.infoContent}>
                        <div className={styles.infoText}>
                            <h3>Hi! I'm...</h3>
                            <h2>Username</h2>
                        </div>
                        <button className={styles.editButton}>Edit</button>
                    </div>
                </div>
                <div className={styles.infoSection}>
                    <div className={styles.infoContent}>
                        <div className={styles.infoText}>
                            <h3>I live at...</h3>
                            <p>Home address here, Postal Code, City, Province</p>
                        </div>
                        <button className={styles.editButton}>Edit</button>
                    </div>
                </div>
                <div className={styles.infoSection}>
                    <div className={styles.infoContent}>
                        <div className={styles.infoText}>
                            <h3>Emergency Contact:</h3>
                            <p>Name: <br/> Phone Number: <br/> Email Address: <br/> Home Address:</p>
                        </div>
                        <button className={styles.editButton}>Edit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
