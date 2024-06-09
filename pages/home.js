import { useEffect, useState, useRef } from 'react';
import Graph from '../components/Graph';
import axios from 'axios';
import styles from '../styles/home.module.css';
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from 'next/link';

export default function Home() {
    const [graphData, setGraphData] = useState({ nodes: [], relationships: [] });
    const [isAudioPlaying, setIsAudioPlaying] = useState(false); // State to track audio playing status
    const audioRef = useRef(null); // Ref to the currently playing audio element

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/graph-data');
                const data = await res.json();
                if (!Array.isArray(data)) {
                    throw new Error('Data is not an array');
                }
                const nodes = [];
                const relationships = [];
                data.forEach(d => {
                    d.nodes.forEach(node => {
                        if (!nodes.some(existingNode => existingNode.name === node.name)) {
                            nodes.push(node);
                        }
                    });
                    if (d.relationship) {
                        relationships.push({
                            from: d.nodes[0].name,
                            to: d.nodes[1] ? d.nodes[1].name : null,
                            type: d.relationship.description || null
                        });
                    }
                });
                setGraphData({
                    nodes: nodes,
                    relationships: relationships
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleNodeClick = (nodeId) => {
    };

    const handleEdgeClick = async (edgeId) => {
        const [fromName, toName] = edgeId.split('-');
        const response = await axios.post('/api/get-edge-description', { fromName, toName });
        const data = response.data;
        var sendName = fromName;
        if (fromName === "David Shan") {
            sendName = toName;
        }
        const res = await axios.post('/api/describe', { prompt: data, name: sendName });
        const jsonString = res.data.data;
        const buffer = await axios.post('/api/speak', { prompt: jsonString });
        
        // Convert ArrayBuffer to Uint8Array
        const audioData = new Uint8Array(buffer.data.response.data);

        // Create a Blob from the audio data
        const blob = new Blob([audioData], { type: 'audio/mpeg' });

        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);

        // Pause the currently playing audio, if any
        if (audioRef.current) {
            audioRef.current.pause();
        }

        // Create an <audio> element
        const audio = new Audio(url);

        // Set the audio element to the audioRef
        audioRef.current = audio;

        // Play the audio
        audio.play();
        setIsAudioPlaying(true); // Update state to indicate audio is playing
    };

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsAudioPlaying(false); // Update state to indicate audio is not playing
        }
    };

    const { user, error, isLoading } = useUser();
    const user_name = user ? user.name : "Guest"; // Fallback to "Guest" if user is not defined
    const user_picture = user ? user.picture : "/default-profile.png"; // Fallback to a default profile picture

    return (
        
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Link href="/personal_info" className={styles.sidebarButton}>
                    <img src={user_picture} alt="Profile" className={styles.profilePicture} />
                    <span>{user_name}</span>
                </Link>
                <Link href="/journal" className={styles.sidebarButton}>Journal</Link>
                <Link href="/home" className={styles.sidebarButtonMain}>Connection</Link>
                <button 
                    className={`${styles.stopButton} ${!isAudioPlaying ? styles.disabledButton : ''}`} 
                    onClick={stopAudio} 
                    disabled={!isAudioPlaying}
                >
                    Stop Audio
                </button>
                <div className={styles.logoSection}>
                </div>
            </div>
            <div className={styles.graphContainer}>
                <h2 className={styles.graphTitle}>Graph View</h2>
                <Graph data={graphData} onNodeClick={handleNodeClick} onEdgeClick={handleEdgeClick} />
            </div>
        </div>
        
    );
}
