import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import React, { useRef, useEffect } from 'react';
const Graph = ({ data, onNodeClick, onEdgeClick }) => {
    const container = useRef(null);

    useEffect(() => {
        if (!data || !data.nodes || !data.relationships) {
            return;
        }
        //console.log(data);
        // Initialize datasets for nodes and edges
        const nodeMap = {}; // Map to store node name to ID mapping
        const nodes = new DataSet(data.nodes.map((node, index) => {
            const nodeId = `node_${index}`; // Generate unique ID for node
            nodeMap[node.name] = nodeId; // Store mapping between node name and ID
            return { id: nodeId, label: node.name };
        }));

        const edges = new DataSet(data.relationships.map((rel, index) => ({
            id: `${rel.from}-${rel.to}`, // Use index as a unique identifier for edges
            from: nodeMap[rel.from], // Retrieve ID of 'from' node from the mapping
            to: nodeMap[rel.to], // Retrieve ID of 'to' node from the mapping
            label: `${rel.from}-${rel.to}`
        })));

        const networkData = { nodes, edges };
        const options = {
            nodes: {
                color: {
                    background: '#ff0000', // Red background color for nodes
                    border: '#000000' // Black border color for nodes
                }
            },
            edges: {
                color: '#00ff00' // Green color for edges
            }
        };

        const network = new Network(container.current, networkData, options);

        // Add event listeners
        network.on('click', (params) => {
            if (params.nodes.length > 0) {
                onNodeClick(params.nodes[0]);
            } else if (params.edges.length > 0) {
                onEdgeClick(params.edges[0]);
            }
        });

        // Clean up event listeners and network on component unmount
        return () => {
            network.off('click');
            network.destroy();
        };
    }, [data, onNodeClick, onEdgeClick]);

    return <div ref={container} style={{ height: '500px' }} />;
};

export default Graph;
