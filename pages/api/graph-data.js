import { getSession } from '../../lib/neo4j';

export default async function handler(req, res) {
    let session;

    try {
        session = getSession();
        const resultWithConnections = await session.run('MATCH (n)-[r]->(m) RETURN n, r, m, type(r) as rel_type LIMIT 100');
        const recordsWithConnections = resultWithConnections.records.map(record => {
            return {
                nodes: [
                    record.get('n').properties,
                    record.get('m').properties,
                ],
                relationship: record.get('r').properties,
            };
        });
        const resultStandaloneNodes = await session.run('MATCH (n) WHERE NOT (n)-[]-() RETURN n LIMIT 100');
        const recordsStandaloneNodes = resultStandaloneNodes.records.map(record => {
            return {
                nodes: [
                    record.get('n').properties,
                ],
                relationship: null,
            };
        });

        const allRecords = [...recordsWithConnections, ...recordsStandaloneNodes];
        console.log(allRecords)
        res.status(200).json(allRecords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (session) {
            await session.close();
        }
    }
}
