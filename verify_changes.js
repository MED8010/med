const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function verifyAutoPointage() {
    console.log('🚀 Verifying Auto Pointage logic...');
    try {
        // 1. Login ADMIN
        const adminLogin = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@rh.app',
            password: 'admin123456'
        });
        const adminToken = adminLogin.data.token;
        const adminHeader = { headers: { Authorization: `Bearer ${adminToken}` } };
        console.log('✅ Admin login successful');

        // 2. Get an employee matricule
        const empRes = await axios.get(`${API_URL}/employes`, adminHeader);
        const testEmp = empRes.data[0];
        console.log(`📡 Using employee: ${testEmp.prenom} ${testEmp.nom} (${testEmp.matricule})`);

        // 3. First Auto Scan (should be ENTREE)
        console.log('\n--- First Auto Scan (Entrée) ---');
        const res1 = await axios.post(`${API_URL}/pointages`, {
            employe_id: testEmp._id,
            scanner_action: 'auto'
        }, adminHeader);
        console.log('Result 1:', res1.data.pointage.heure_entree ? `Entrée at ${res1.data.pointage.heure_entree}` : 'FAILED');
        if (!res1.data.pointage.heure_entree) throw new Error('Heure entree missing');

        // 4. Second Auto Scan (should be SORTIE)
        console.log('\n--- Second Auto Scan (Sortie) ---');
        const res2 = await axios.post(`${API_URL}/pointages`, {
            employe_id: testEmp._id,
            scanner_action: 'auto'
        }, adminHeader);
        console.log('Result 2:', res2.data.pointage.heure_sortie ? `Sortie at ${res2.data.pointage.heure_sortie}` : 'FAILED');
        if (!res2.data.pointage.heure_sortie) throw new Error('Heure sortie missing');

        console.log('\n✅ AUTO POINTAGE VERIFICATION PASSED!');

    } catch (error) {
        console.error('\n❌ VERIFICATION FAILED');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
}

async function verifyStagesRoute() {
    console.log('\n🚀 Verifying Stages API Route...');
    try {
        const adminLogin = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@rh.app',
            password: 'admin123456'
        });
        const adminToken = adminLogin.data.token;
        const adminHeader = { headers: { Authorization: `Bearer ${adminToken}` } };

        const res = await axios.get(`${API_URL}/stages`, adminHeader);
        console.log(`✅ Stages route is accessible. Found ${res.data.length} requests.`);
    } catch (error) {
        console.error('\n❌ STAGES VERIFICATION FAILED');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
}

async function main() {
    await verifyAutoPointage();
    await verifyStagesRoute();
}

main();
