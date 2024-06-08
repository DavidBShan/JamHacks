import { getSession } from '../../lib/neo4j';

export default async function handler(req, res) {
    let session; 

    try {
        session = getSession(); 
        const result = await session.run('MATCH (n)-[r]->(m) RETURN n, r, m, type(r) as rel_type LIMIT 100');
        const records = result.records.map(record => {
            return {
                nodes: [
                    record.get('n').properties,
                    record.get('m').properties,
                ],
                relationship: record.get('r').properties,
            };
        });
        console.log(records[0]);
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (session) {
            await session.close();
        }
    }
}
