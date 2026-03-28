const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function runAutoPointageTests() {
    console.log('🚀 Starting Auto-Pointage API Tests...');
    try {
        // 1. Login ADMIN
        console.log('\n--- 1. Login ADMIN ---');
        const adminLogin = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@rh.app',
            password: 'Password123!'
        });
        const adminToken = adminLogin.data.token;
        const adminHeader = { headers: { Authorization: `Bearer ${adminToken}` } };
        console.log('✅ Admin login successful');

        // 2. Get an existing employee matricule
        console.log('\n--- 2. Get Employee ---');
        const empRes = await axios.get(`${API_URL}/employes`, adminHeader);
        const employee = empRes.data[0];
        const employeeId = employee._id;
        const matricule = employee.matricule;
        console.log(`✅ Testing with Employee: ${employee.prenom} ${employee.nom} (${matricule})`);

        // 3. Perform First Auto-Pointage (should be 'entree')
        console.log('\n--- 3. First Auto-Pointage (Entry) ---');
        const res1 = await axios.post(`${API_URL}/pointages`, {
            employe_id: employeeId,
            scanner_action: 'auto'
        }, adminHeader);

        console.log('Response Action:', res1.data.pointage.heure_entree ? 'Entry Recorded' : 'Error');
        if (res1.data.pointage.heure_entree && !res1.data.pointage.heure_sortie) {
            console.log('✅ First auto-pointage correctly identified as Entry');
        } else {
            throw new Error('First auto-pointage should be an entry only');
        }

        // 4. Perform Second Auto-Pointage (should be 'sortie')
        console.log('\n--- 4. Second Auto-Pointage (Exit) ---');
        const res2 = await axios.post(`${API_URL}/pointages`, {
            employe_id: employeeId,
            scanner_action: 'auto'
        }, adminHeader);

        console.log('Response Action:', res2.data.pointage.heure_sortie ? 'Exit Recorded' : 'Error');
        if (res2.data.pointage.heure_entree && res2.data.pointage.heure_sortie) {
            console.log('✅ Second auto-pointage correctly identified as Exit');
        } else {
            throw new Error('Second auto-pointage should have recorded the exit');
        }

        console.log('\n✨ AUTO-POINTAGE TESTS PASSED! ✨');

    } catch (error) {
        console.error('\n❌ TEST FAILED');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
        process.exit(1);
    }
}

runAutoPointageTests();
