import { getSession } from '../../lib/neo4j';

export default async function handler(req, res) {
    let session;

    try {
        session = getSession();

        // Extract necessary data from request body
        const { fromNodeName, toNodeName, description } = req.body;

        // Check if all required fields are present
        if (!fromNodeName || !toNodeName || !description) {
            throw new Error('Missing required fields: fromNodeName, toNodeName, description');
        }

        // Create relationship between nodes based on their names
        await session.run(
            'MATCH (fromNode {name: $fromNodeName}), (toNode {name: $toNodeName}) CREATE (fromNode)-[:FRIENDS_WITH {description: $description}]->(toNode)',
            { fromNodeName, toNodeName, description }
        );

        res.status(200).json({ message: 'Relationship created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (session) {
            await session.close();
        }
    }
}
