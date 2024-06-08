import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import React, { useRef, useEffect } from 'react';

// Import Font Awesome to ensure it is available globally
import '@fortawesome/fontawesome-free/css/all.css';

const Graph = ({ data, onNodeClick, onEdgeClick }) => {
    const container = useRef(null);

    useEffect(() => {
        if (!data || !data.nodes || !data.relationships) {
            return;
        }

        const nodeMap = {}; // Map to store node name to ID mapping
        const nodes = new DataSet(data.nodes.map((node, index) => {
            const nodeId = `node_${index}`; // Generate unique ID for node
            nodeMap[node.name] = nodeId; // Store mapping between node name and ID
            return { id: nodeId, label: node.name };
        }));

        const edges = new DataSet(data.relationships.map((rel) => ({
            id: `${rel.from}-${rel.to}`, // Use from-to as a unique identifier for edges
            from: nodeMap[rel.from], // Retrieve ID of 'from' node from the mapping
            to: nodeMap[rel.to]
        })));

        const networkData = { nodes, edges };
        const options = {
            nodes: {
                shape: "icon",
                icon: {
                    face: "'Font Awesome 5 Free'",
                    weight: "900", // Font Awesome 5 requires a weight of 900 (bold)
                    code: "\uf183", // Unicode for the 'person' icon
                    size: 50,
                    color: "#f0a30a",
                },
            },
            edges: {
                color: '#00ff00' // Green color for edges
            }
        };

        // Ensure the font is loaded before creating the network
        document.fonts.ready.then(() => {
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
        });
    }, [data, onNodeClick, onEdgeClick]);

    return <div ref={container} style={{ height: '700px' }} />;
};

export default Graph;
