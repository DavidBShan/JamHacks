import { getSession } from '../../lib/neo4j';

export default async function handler(req, res) {
    let session;
    try {
        session = getSession();
        const { nodeName } = req.body;
        if (!nodeName) {
            throw new Error('Node name is missing in the request body.');
        }

        const params = { nodeName };

        // Check if the node already has a journal property
        const checkQuery = `
            MATCH (n:Person {name: $nodeName})
            RETURN n.journal AS journal
        `;
        const result = await session.run(checkQuery, params);
        const record = result.records[0];
        const existingJournal = record && record.get('journal');

        let journalEntries;
        if (!existingJournal) {
            // If the node doesn't have a journal property, return default entry
            journalEntries = [
                { date: '2024-06-09', content: 'Example of a journal entry you could write! When writing your first journal, focus on the name of the person you did it with, specifically their full name. After you write your journal, check out the connections page to see the people you know grow!' }
            ];
        } else {
            // If the node has a journal property, parse the entries
            journalEntries = existingJournal.map(entry => JSON.parse(entry));
        }

        res.status(200).json(journalEntries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        if (session) {
            await session.close();
        }
    }
}
