import { getSession } from '../../lib/neo4j';

export default async function handler(req, res) {
    let session;
    try {
        session = getSession();
        const { nodeName } = req.body;
        if (!nodeName) {
            throw new Error('Missing required field: nodeName');
        }
        const result = await session.run(
            'MATCH (n {name: $nodeName}) RETURN COUNT(n) AS nodeCount',
            { nodeName }
        );
        const nodeCount = result.records[0].get('nodeCount').toNumber();
        const nodeExists = nodeCount > 0;
        res.status(200).json({ nodeExists });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (session) {
            await session.close();
        }
    }
}
