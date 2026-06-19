const axios = require('axios');
const API_URL = 'http://localhost:5000/api';

async function testAutoPointage() {
    console.log('🚀 Testing Auto Pointage Logic...');
    try {
        // 1. Login ADMIN
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@rh.app',
            password: 'admin123456' // Using the password from seed.js or memory
        });
        const token = loginRes.data.token;
        const header = { headers: { Authorization: `Bearer ${token}` } };
        console.log('✅ Logged in as Admin');

        // 2. Get an employee
        const empRes = await axios.get(`${API_URL}/employes`, header);
        const employee = empRes.data[0];
        console.log(`👤 Testing with employee: ${employee.prenom} ${employee.nom} (${employee.matricule})`);

        // 3. Trigger Auto Pointage - First time (should be 'entree')
        console.log('\n--- First scan (Auto) ---');
        const res1 = await axios.post(`${API_URL}/pointages`, {
            employe_id: employee._id,
            scanner_action: 'auto'
        }, header);
        console.log('Response:', res1.data.message);
        console.log('Effective Action:', res1.data.pointage.effectiveAction);
        if (res1.data.pointage.effectiveAction !== 'entree') {
            throw new Error('Expected "entree" for first scan');
        }

        // 4. Trigger Auto Pointage - Second time (should be 'sortie')
        console.log('\n--- Second scan (Auto) ---');
        const res2 = await axios.post(`${API_URL}/pointages`, {
            employe_id: employee._id,
            scanner_action: 'auto'
        }, header);
        console.log('Response:', res2.data.message);
        console.log('Effective Action:', res2.data.pointage.effectiveAction);
        if (res2.data.pointage.effectiveAction !== 'sortie') {
            throw new Error('Expected "sortie" for second scan');
        }

        console.log('\n✨ AUTO POINTAGE LOGIC VERIFIED! ✨');

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

testAutoPointage();
