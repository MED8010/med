const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function runTests() {
    console.log('🚀 Starting API Tests (Multi-Role)...');
    try {
        // 1. Login ADMIN for setup
        console.log('\n--- 1. Login ADMIN ---');
        const adminLogin = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@rh.app',
            password: 'Password123!'
        });
        const adminToken = adminLogin.data.token;
        const adminHeader = { headers: { Authorization: `Bearer ${adminToken}` } };
        console.log('✅ Admin login successful');

        // 2. Get Structure
        console.log('\n--- 2. Structure ---');
        const servicesRes = await axios.get(`${API_URL}/structure/services`, adminHeader);
        const uapsRes = await axios.get(`${API_URL}/structure/uaps`, adminHeader);
        const serviceId = servicesRes.data[0]._id;
        const uapId = uapsRes.data[0]._id;
        console.log(`✅ Service: ${servicesRes.data[0].nom_service}, UAP: ${uapsRes.data[0].nom_uap}`);

        // 3. Create Employee
        console.log('\n--- 3. Create Employee ---');
        const matricule = 'API' + Date.now().toString().slice(-4);
        const empEmail = `test.${matricule}.${Date.now()}@rh.app`;
        const empPassword = 'Password123!';
        const empData = {
            matricule: matricule,
            nom: 'Test',
            prenom: 'API',
            prix_heure: 200,
            service: serviceId,
            uap: uapId,
            email: empEmail,
            password: empPassword,
            role: 'employe',
            date_embauche: new Date().toISOString()
        };
        const empRes = await axios.post(`${API_URL}/employes`, empData, adminHeader);
        const employeeId = empRes.data.employe._id;
        console.log(`✅ Employee created: ${matricule} (${empEmail})`);

        // 4. Login as NEW EMPLOYEE
        console.log('\n--- 4. Login EMPLOYEE ---');
        const empLogin = await axios.post(`${API_URL}/auth/login`, {
            email: empEmail,
            password: empPassword
        });
        const empToken = empLogin.data.token;
        const empHeader = { headers: { Authorization: `Bearer ${empToken}` } };
        console.log('✅ Employee login successful');

        // 5. Pointage (as Employee)
        console.log('\n--- 5. Pointage (as Employee) ---');
        await axios.post(`${API_URL}/pointages`, {
            employe_id: employeeId,
            date: new Date().toISOString().split('T')[0],
            heure_entree: '08:00',
            heure_sortie: '17:00',
            absence: false
        }, empHeader);
        console.log('✅ Pointage recorded');

        // 6. Conge (as Employee)
        console.log('\n--- 6. Conge (as Employee) ---');
        await axios.post(`${API_URL}/conges`, {
            employe_id: employeeId,
            date_debut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            date_fin: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
            type: 'annuel',
            motif: 'Test API Multi-Role'
        }, empHeader);
        console.log('✅ Conge request created');

        // 7. Salary (as ADMIN)
        console.log('\n--- 7. Salary (as ADMIN) ---');
        await axios.post(`${API_URL}/salaires/calculate`, {
            employe_id: employeeId,
            mois: new Date().getMonth() + 1,
            annee: new Date().getFullYear()
        }, adminHeader);
        console.log('✅ Salary calculated');

        console.log('\n✨ ALL MULTI-ROLE TESTS PASSED! ✨');

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

runTests();
