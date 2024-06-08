import { getSession } from '../../lib/neo4j';

export default async function handler(req, res) {
    let session;
    try {
        session = getSession();
        const { fromName, toName } = req.body;
        if (!fromName || !toName) {
            throw new Error('Missing required fields: from and toName');
        }
        const result = await session.run(
            'MATCH (a {name: $fromName})-[e]->(b {name: $toName}) RETURN e.description AS description',
            { fromName, toName }
        );
        if (result.records.length === 0) {
            throw new Error('Edge not found');
        }
        const description = result.records[0].get('description');
        res.status(200).json({ description });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (session) {
            await session.close();
        }
    }
}
