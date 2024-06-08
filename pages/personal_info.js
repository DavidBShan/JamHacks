import { useState } from 'react';
import styles from '../styles/personal_info.module.css';

export default function PersonalInfo() {
    return (
        <div className="container">
            <header className="header">
                <img src="logo.png" alt="RecallAID Logo" className="logo" />
                <h1>RecallAID - Personal Info</h1>
            </header>
            <div className="sidebar">
                <div className="usernameSection">Username</div>
                <button className="sidebarButton">Connection</button>
                <button className="sidebarButton">Personal Info</button>
                <button className="sidebarButton">Journal</button>
            </div>
            <div className="content">
                <div className="infoCard">
                    <div className="infoHeader">
                        <img src="user-icon.png" alt="User Icon" className="userIcon" />
                        <h2>Hi! I’m... Username</h2>
                        <button className="editButton">Edit</button>
                    </div>
                </div>
                <div className="infoCard">
                    <h3>I live at...</h3>
                    <p>Home address here, Postal Code, City, Province</p>
                    <button className="editButton">Edit</button>
                </div>
                <div className="infoCard">
                    <h3>Emergency Contact:</h3>
                    <p>Name: <br /> Phone Number: <br /> Email Address: <br /> Home Address:</p>
                    <button className="editButton">Edit</button>
                </div>
            </div>
        </div>
    );
}
