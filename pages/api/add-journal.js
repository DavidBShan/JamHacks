import { getSession } from '../../lib/neo4j';

export default async function handler(req, res) {
    let session;
    try {
        session = getSession();
        const { nodeName, date, content } = req.body;
        if (!nodeName) {
            throw new Error('Node name is missing in the request body.');
        }

        // Check if both date and content are provided
        if (!date || !content) {
            throw new Error('Both date and content must be provided.');
        }

        const entry = { date, content };
        const serializedEntry = JSON.stringify(entry);
        const params = { nodeName, serializedEntry };

        // Check if the node already has a journal property
        const checkQuery = `
            MATCH (n:Person {name: $nodeName})
            RETURN n.journal AS journal
        `;
        const result = await session.run(checkQuery, { nodeName });
        const record = result.records[0];
        const existingJournal = record && record.get('journal');

        let query;
        if (!existingJournal) {
            // If the node doesn't have a journal property, create one
            query = `
                MATCH (n:Person {name: $nodeName})
                SET n.journal = [$serializedEntry]
            `;
        } else {
            // If the node already has a journal property, append the new entry
            query = `
                MATCH (n:Person {name: $nodeName})
                SET n.journal = n.journal + $serializedEntry
            `;
        }

        await session.run(query, params);

        res.status(200).json({ message: 'Node updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        if (session) {
            await session.close();
        }
    }
}
