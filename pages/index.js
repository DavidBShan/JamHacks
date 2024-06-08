import { useEffect, useState } from 'react';
import Graph from '../components/Graph';
import axios from 'axios';

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
                        d.nodes.forEach(node => {
                            if (!nodes.some(existingNode => existingNode.name === node.name)) {
                                nodes.push(node);
                            }
                        });
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
        if (fromName == "David Shan"){
            sendName = toName;
        }
        const res = await axios.post('/api/describe', { prompt: data, name: sendName });
        const jsonString = res.data.data;
        console.log('Edge clicked:', jsonString);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">AuraDB Graph Visualization</h1>
            <Graph data={graphData} onNodeClick={handleNodeClick} onEdgeClick={handleEdgeClick} />
        </div>
    );
}
