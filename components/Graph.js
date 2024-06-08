import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import React, { useRef, useEffect } from 'react';

const Graph = ({ data, onNodeClick, onEdgeClick }) => {
    const container = useRef(null);

    useEffect(() => {
        if (!data || !data.nodes || !data.relationships) {
            return;
        }

        // Initialize datasets for nodes and edges
        const nodes = new DataSet(data.nodes.map(node => ({ id: node.name, label: node.name })));
        const edges = new DataSet(data.relationships.map(rel => ({
            id: `${rel.from}-${rel.to}`,
            from: rel.from,
            to: rel.to,
            label: `${rel.from}-${rel.to}`
        })));
        // rel.type is descripiton
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
