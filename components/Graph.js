import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import React, { useRef, useState, useEffect } from 'react';
import { useUser } from "@auth0/nextjs-auth0/client";
import Modal from './Modal'; // Import the Modal component

const Graph = ({ data, onNodeClick, onEdgeClick }) => {
    const container = useRef(null);
    const [isModalOpen, setModalOpen] = useState(false); // State to control modal visibility
    const { user } = useUser();
    const user_name = user ? user.name : "Guest";
    const user_picture = user ? user.picture : "/default-profile.png";

    const countConnections = (data) => {
        const connectionCounts = {};
        data.relationships.forEach((rel) => {
            if (!connectionCounts[rel.from]) {
                connectionCounts[rel.from] = 0;
            }
            if (!connectionCounts[rel.to]) {
                connectionCounts[rel.to] = 0;
            }
            connectionCounts[rel.from] += 1;
            connectionCounts[rel.to] += 1;
        });
        return connectionCounts;
    };

    const connections = countConnections(data);

    useEffect(() => {
        if (!data || !data.nodes || !data.relationships) {
            return;
        }

        const nodeMap = {}; // Map to store node name to ID mapping
        const nodes = new DataSet(data.nodes.map((node, index) => {
            const nodeId = `node_${index}`; // Generate unique ID for node
            nodeMap[node.name] = nodeId; // Store mapping between node name and ID
            return {
                id: nodeId,
                label: node.name,
                shape: 'circularImage', // Use circular image shape
                image: 'https://cdn-icons-png.freepik.com/512/4323/4323020.png', // Set the image for the node
                size: 30 + (connections[node.name] || 0) * 2 // Adjust size based on connections
            };
        }));

        const edges = new DataSet(data.relationships.map((rel) => ({
            id: `${rel.from}-${rel.to}`, // Use from-to as a unique identifier for edges
            from: nodeMap[rel.from], // Retrieve ID of 'from' node from the mapping
            to: nodeMap[rel.to]
        })));

        const networkData = { nodes, edges };
        const options = {
            interaction: {
                navigationButtons: true, // Enable navigation buttons
                keyboard: true, // Enable keyboard controls
            },
            nodes: {
                borderWidth: 2,
                borderWidthSelected: 4,
                color: {
                    border: '#2B7CE9',
                    background: '#D2E5FF',
                    highlight: {
                        border: '#2B7CE9',
                        background: '#D2E5FF'
                    },
                    hover: {
                        border: '#2B7CE9',
                        background: '#FFFF00' // Change background color on hover
                    }
                },
                font: {
                    color: 'white', // Set the label color to white
                    size: 14, // px
                    face: 'arial',
                    background: 'none',
                    strokeWidth: 0, // px
                    strokeColor: '#ffffff'
                }
            },
            physics: {
                forceAtlas2Based: {
                    gravitationalConstant: -26,
                    centralGravity: 0.005,
                    springLength: 230,
                    springConstant: 0.08,
                },
                maxVelocity: 16,
                solver: "forceAtlas2Based",
                timestep: 0.35,
                stabilization: { iterations: 150 },
            },
            edges: {
                color: '#03c6fc' // Green color for edges
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

    return (
        <div>
            <button 
                style={{ 
                    position: 'absolute', 
                    top: '10px', 
                    right: '10px', 
                    zIndex: 1000, 
                    backgroundColor: '#b19a6c', // Blue background
                    color: 'white', // White text
                    padding: '10px 20px', // Padding
                    border: 'none', // Remove border
                    borderRadius: '5px', // Rounded corners
                    cursor: 'pointer', // Pointer cursor on hover
                    fontWeight: 'bold' // Bold text
                }} 
                onClick={() => setModalOpen(true)}
            >
                Show Instructions
            </button>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <h1>Instructions</h1>
                <p>Press ] or [ for zooming</p>
                <p>Press UP/DOWN/LEFT/RIGHT to pan frame</p>
                <p>Click on relationship lines to listen for memories</p>
            </Modal>

            <div ref={container} style={{ height: 'calc(100vh - 120px)', width: 'calc(100% - 40px)', marginTop: '0px', marginLeft: '20px', marginBottom: '50px' }} />
        </div>
    );
};

export default Graph;
