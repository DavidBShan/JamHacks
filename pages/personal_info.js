import { useState } from 'react';
import styles from '../styles/personal_info.module.css';
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
    const { user, error, isLoading } = useUser();
    const user_name = user ? user.name : "Guest";
    const user_picture = user ? user.picture : "/default-profile.png";

    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isEditingEmergencyContact, setIsEditingEmergencyContact] = useState(false);

    const [name, setName] = useState(user_name);
    const [address, setAddress] = useState("Home address here, Postal Code, City, Province");
    const [emergencyContact, setEmergencyContact] = useState({
        name: "",
        phone: "",
        email: "",
        home: "",
    });

    const handleEditAddressClick = () => {
        setIsEditingAddress(true);
    };

    const handleSaveAddressClick = () => {
        setIsEditingAddress(false);
    };

    const handleEditEmergencyContactClick = () => {
        setIsEditingEmergencyContact(true);
    };

    const handleSaveEmergencyContactClick = () => {
        setIsEditingEmergencyContact(false);
    };

    const handleChange = (e, setter) => {
        setter(e.target.value);
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.logoSection}>
                        
                </div>
                <div className={styles.usernameSection}>
                        <img src={user_picture} alt="Profile" className={styles.profilePicture} />
                        <h1>{user_name}</h1>
                </div>
                <button className={styles.sidebarButton}>Connection</button>
                <button className={styles.sidebarButton}>Personal Info</button>
                <button className={styles.sidebarButton}>Journal</button>
            </div>
            <div className={styles.content}>
                <div className={styles.infoSection}>
                    <div className={styles.infoContent}>
                        <div className={styles.infoText}>
                            <img src={user_picture} alt="Profile" className={styles.largeProfilePicture} />
                            <div>
                                <h3>Hi! I'm...</h3>
                                <h2>{user_name}</h2>
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
