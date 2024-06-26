import { getSession } from '../../lib/neo4j';

export default async function handler(req, res) {
    let session;
    try {
        session = getSession();
        const { nodeName} = req.body;
        if (!nodeName) {
            throw new Error('Node name is missing in the request body.');
        }
        
        const query = `
            CREATE (n:Person {
                name: $nodeName,
                address: "",
                emergencyName: "",
                emergencyPhone: "",
                emergencyEmail: "",
                emergencyHome: ""
            })
        `;

        await session.run(query, {nodeName});
        
        res.status(200).json({ message: 'Node created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (session) {
            await session.close();
        }
    }
}
