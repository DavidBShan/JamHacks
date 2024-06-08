import { useEffect, useState } from 'react';
import Graph from '../components/Graph';
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

                const nodes = [];
                const relationships = [];
                data.forEach(d => {
                    // Extract nodes
                    d.nodes.forEach(node => {
                        nodes.push(node);
                    });

                    // Extract relationships (if present)
                    if (d.relationship) {
                        relationships.push({
                            from: d.nodes[0].name,
                            to: d.nodes[1] ? d.nodes[1].name : null, // Check if the second node exists
                            type: d.relationship.description || null // Check if the relationship exists
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
        console.log('Node clicked:', nodeId);
    };

    const handleEdgeClick = (edgeId) => {
        console.log('Edge clicked:', edgeId);
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
