import { getSession } from '../../lib/neo4j';

export default async function handler(req, res) {
    let session;
    try {
        session = getSession();
        const { nodeName } = req.body;
        
        if (!nodeName) {
            throw new Error('Node name is missing in the request body.');
        }

        const query = `
            MATCH (n:Person {name: $nodeName})
            RETURN n.address AS address, n.emergencyName AS emergencyName, n.emergencyPhone AS emergencyPhone, n.emergencyEmail AS emergencyEmail, n.emergencyHome AS emergencyHome
        `;

        const result = await session.run(query, { nodeName });
        const nodeData = result.records[0].toObject();

        res.status(200).json(nodeData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (session) {
            await session.close();
        }
    }
}
