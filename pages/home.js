import { useEffect, useState } from 'react';
import Graph from '../components/Graph';
import axios from 'axios';
import styles from '../styles/home.module.css';
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
    const [graphData, setGraphData] = useState({ nodes: [], relationships: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/graph-data');
                const data = await res.json();
                if (!Array.isArray(data)) {
                    throw new Error('Data is not an array');
                }
                console.log(data)
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
                console.log(nodes, relationships)
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
        console.log('Node clicked:', nodeId);
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
        console.log(buffer.data.response.data);
        
        // Convert ArrayBuffer to Uint8Array
        const audioData = new Uint8Array(buffer.data.response.data);

        // Create a Blob from the audio data
        const blob = new Blob([audioData], { type: 'audio/mpeg' });

        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);

        // Create an <audio> element
        const audio = new Audio(url);

        // Play the audio
        audio.play();

        console.log('Edge clicked:', jsonString);
    };

    const { user, error, isLoading } = useUser();
    const user_name = user ? user.name : "Guest"; // Fallback to "Guest" if user is not defined
    const user_picture = user ? user.picture : "/default-profile.png"; // Fallback to a default profile picture

    return (
        <div className="container mx-auto p-4">
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <div className={styles.usernameSection}>
                        <span>{user_name}</span>
                        <img src={user_picture} alt="Profile" className={styles.profilePicture} />
                    </div>
                    <button className={styles.sidebarButton}>Connection</button>
                    <button className={styles.sidebarButton}>Personal Info</button>
                    <button className={styles.sidebarButton}>Journal</button>
                </div>
                <div className={styles.graphContainer}>
                    <h2 className={styles.graphTitle}>Graph View</h2>
                    <Graph data={graphData} onNodeClick={handleNodeClick} onEdgeClick={handleEdgeClick} />
                </div>
            </div>
        </div>
    );
}
