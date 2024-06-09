import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/personal_info.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Import useRouter

export default function UserProfile() {
    const router = useRouter(); // Initialize useRouter
    const { username } = router.query; // Get username from the URL path
    const user_name = username ? username : "Guest";
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isEditingEmergencyContact, setIsEditingEmergencyContact] = useState(false);
    const [address, setAddress] = useState("");
    const [emergencyContact, setEmergencyContact] = useState({
        name: "",
        phone: "",
        email: "",
        home: "",
    });

    useEffect(() => {
        if (username) { // Fetch data only if username exists
            checkAndAddNode(username); // Pass username to the function
        }
    }, [username]);

    const handleEditAddressClick = () => {
        setIsEditingAddress(true);
    };

    const handleSaveAddressClick = async () => {
        setIsEditingAddress(false);
        try {
            console.log('Updating address:', address)
            console.log('User name:', user_name)
            await axios.post('/api/edit-node', {
                nodeName: user_name,
                address: address,
                emergencyName: emergencyContact.name,
                emergencyPhone: emergencyContact.phone,
                emergencyEmail: emergencyContact.email,
                emergencyHome: emergencyContact.home,
            });
        } catch (error) {
            console.error('Error updating address:', error);
        }
    };

    const handleEditEmergencyContactClick = () => {
        setIsEditingEmergencyContact(true);
    };

    const capitalizeWords = (str) => {
        if(!str) return str;
        return str.replace(/([A-Z])/g, ' $1').trim(); // Add space before capital letters
    };

    const handleSaveEmergencyContactClick = async () => {
        setIsEditingEmergencyContact(false);
        try {
            console.log("Updating emergency contact:", emergencyContact);
            await axios.post('/api/edit-node', {
                nodeName: user_name,
                address: address,
                emergencyName: emergencyContact.name,
                emergencyPhone: emergencyContact.phone,
                emergencyEmail: emergencyContact.email,
                emergencyHome: emergencyContact.home,
            });
        } catch (error) {
            console.error('Error updating emergency contact:', error);
        }
    };

    const checkAndAddNode = async (userName) => {
        try {
            if(!userName) return;
            const nodeData = await axios.post(`/api/get-node-data`, {nodeName: capitalizeWords(userName)});
            console.log(nodeData.data);
            const data = nodeData.data;
            setAddress(data.address);
            setEmergencyContact({
                name: data.emergencyName,
                phone: data.emergencyPhone,
                email: data.emergencyEmail,
                home: data.emergencyHome,
            });
        } catch (error) {
            console.error('Error checking or adding node:', error);
        }
    };

    const handleChange = (e, setter) => {
        setter(e.target.value);
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.usernameSection}>
                    <Link href="/personal_info">
                        <span>{capitalizeWords(username)}</span>
                    </Link>
                </div>
                <Link href="/journal" className={styles.sidebarButton}>Journal</Link>
                <Link href="/home" className={styles.sidebarButton}>Connection</Link>
                <div className={styles.logoSection}></div>
            </div>
            <div className={styles.content}>
                <div className={styles.infoSection}>
                    <div className={styles.infoContent}>
                        <div className={styles.largeProfilePictureContainer}>
                            <div>
                                <h3>Hi! I'm...</h3>
                                <h2>{capitalizeWords(username)}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.infoSection}>
                    <div className={styles.infoContent}>
                        <div className={styles.infoText}>
                            {isEditingAddress ? (
                                <>
                                    <h3>I live at...</h3>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => handleChange(e, setAddress)}
                                        className={styles.input}
                                    />
                                </>
                            ) : (
                                <>
                                    <h3>I live at...</h3>
                                    <p>{address}</p>
                                </>
                            )}
                        </div>
                        {isEditingAddress ? (
                            <button className={styles.editButton} onClick={handleSaveAddressClick}>
                                Save
                            </button>
                        ) : (
                            <button className={styles.editButton} onClick={handleEditAddressClick}>
                                Edit
                            </button>
                        )}
                    </div>
                </div>
                <div className={styles.infoSection}>
                    <div className={styles.infoContent}>
                        <div className={styles.infoText}>
                            {isEditingEmergencyContact ? (
                                <>
                                    <h3>Emergency Contact:</h3>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={emergencyContact.name}
                                        onChange={(e) =>
                                            setEmergencyContact({
                                                ...emergencyContact,
                                                name: e.target.value,
                                            })
                                        }
                                        className={styles.input}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        value={emergencyContact.phone}
                                        onChange={(e) =>
                                            setEmergencyContact({
                                                ...emergencyContact,
                                                phone: e.target.value,
                                            })
                                        }
                                        className={styles.input}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={emergencyContact.email}
                                        onChange={(e) =>
                                            setEmergencyContact({
                                                ...emergencyContact,
                                                email: e.target.value,
                                            })
                                        }
                                        className={styles.input}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Home Address"
                                        value={emergencyContact.home}
                                        onChange={(e) =>
                                            setEmergencyContact({
                                                ...emergencyContact,
                                                home: e.target.value,
                                            })
                                        }
                                        className={styles.input}
                                    />
                                </>
                            ) : (
                                <>
                                    <h3>Emergency Contact:</h3>
                                    <p>
                                        Name: {emergencyContact.name} <br />
                                        Phone Number: {emergencyContact.phone} <br />
                                        Email Address: {emergencyContact.email} <br />
                                        Home Address: {emergencyContact.home}
                                    </p>
                                </>
                            )}
                        </div>
                        {isEditingEmergencyContact ? (
                            <button className={styles.editButton} onClick={handleSaveEmergencyContactClick}>
                                Save
                            </button>
                        ) : (
                            <button className={styles.editButton} onClick={handleEditEmergencyContactClick}>
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
