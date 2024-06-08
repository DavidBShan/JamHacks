import { getSession } from '../../lib/neo4j';

export default async function handler(req, res) {
    let session;

    try {
        session = getSession();

        const { fromNodeName, toNodeName } = req.body;

        if (!fromNodeName || !toNodeName) {
            throw new Error('Missing required fields: fromNodeName, toNodeName');
        }

        const result = await session.run(
            'MATCH (fromNode {name: $fromNodeName})-[r]-(toNode {name: $toNodeName}) RETURN COUNT(r) AS relationshipCount',
            { fromNodeName, toNodeName }
        );

        const relationshipExists = result.records[0].get('relationshipCount').toNumber() > 0;
        res.status(200).json({ relationshipExists });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (session) {
            await session.close();
        }
    }
}
