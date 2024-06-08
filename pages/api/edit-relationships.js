import { getSession } from '../../lib/neo4j';

export default async function handler(req, res) {
    let session;

    try {
        session = getSession();
        const { fromNodeName, toNodeName, newDescription } = req.body;

        if (!fromNodeName || !toNodeName || !newDescription) {
            throw new Error('Missing required fields: fromNodeName, toNodeName, newDescription');
        }
        const currentDescriptionResult = await session.run(
            'MATCH (fromNode {name: $fromNodeName})-[r:FRIENDS_WITH]->(toNode {name: $toNodeName}) ' +
            'RETURN r.description AS currentDescription',
            { fromNodeName, toNodeName }
        );
        const currentDescription = currentDescriptionResult.records[0].get('currentDescription');
        const updatedDescription = currentDescription ? `${currentDescription} ${newDescription}` : newDescription;
        
        await session.run(
            'MATCH (fromNode {name: $fromNodeName})-[r:FRIENDS_WITH]->(toNode {name: $toNodeName}) ' +
            'SET r.description = $updatedDescription',
            { fromNodeName, toNodeName, updatedDescription }
        );

        await session.run(
            'MATCH (fromNode {name: $toNodeName})-[r:FRIENDS_WITH]->(toNode {name: $fromNodeName}) ' +
            'SET r.description = $updatedDescription',
            { toNodeName, fromNodeName, updatedDescription }
        );
        res.status(200).json({ message: 'Relationship description updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (session) {
            await session.close();
        }
    }
}
