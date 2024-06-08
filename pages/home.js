import { useEffect, useState } from 'react';
import Graph from '../components/Graph';

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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">AuraDB Graph Visualization</h1>
            <Graph data={graphData} onNodeClick={handleNodeClick} onEdgeClick={handleEdgeClick} />
        </div>
    );
}