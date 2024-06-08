    import { getSession } from '../../lib/neo4j';

    export default async function handler(req, res) {
        let session;
        try {
            session = getSession();
            const { nodeName, address, emergencyName, emergencyPhone, emergencyEmail, emergencyHome } = req.body;
            if (!nodeName) {
                throw new Error('Node name is missing in the request body.');
            }

            const updates = [];
            const params = { nodeName };

            if (address) {
                updates.push('n.address = $address');
                params.address = address;
            }
            if (emergencyName) {
                updates.push('n.emergencyName = $emergencyName');
                params.emergencyName = emergencyName;
            }
            if (emergencyPhone) {
                updates.push('n.emergencyPhone = $emergencyPhone');
                params.emergencyPhone = emergencyPhone;
            }
            if (emergencyEmail) {
                updates.push('n.emergencyEmail = $emergencyEmail');
                params.emergencyEmail = emergencyEmail;
            }
            if (emergencyHome) {
                updates.push('n.emergencyHome = $emergencyHome');
                params.emergencyHome = emergencyHome;
            }

            if (updates.length === 0) {
                throw new Error('No properties to update were provided.');
            }

            const query = `
                MATCH (n:Person {name: $nodeName})
                SET ${updates.join(', ')}
            `;

            await session.run(query, params);
            
            res.status(200).json({ message: 'Node updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        } finally {
            if (session) {
                await session.close();
            }
        }
    }
