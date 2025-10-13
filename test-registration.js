const axios = require('axios');

async function testUserRegistration() {
    const testUser = {
        firstName: "Alice",
        lastName: "Johnson", 
        email: "alice.johnson@crk.umn.edu",
        password: "SecurePass123!",
        studentId: "AJ001",
        phone: "218-555-0199",
        role: "student"
    };

    try {
        console.log('🧪 Testing User Registration...');
        console.log('Test User Data:', JSON.stringify(testUser, null, 2));
        
        const response = await axios.post('http://localhost:5000/api/auth/register', testUser, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Registration Successful!');
        console.log('Status:', response.status);
        console.log('User Created:', {
            id: response.data.user.id,
            name: `${response.data.user.firstName} ${response.data.user.lastName}`,
            email: response.data.user.email,
            role: response.data.user.role,
            studentId: response.data.user.studentId
        });
        console.log('Token received:', response.data.token ? 'Yes' : 'No');

        return true;
    } catch (error) {
        console.log('❌ Registration Failed');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Error:', error.response.data);
        } else {
            console.log('Network Error:', error.message);
        }
        return false;
    }
}

// Run the test
testUserRegistration().then(success => {
    if (success) {
        console.log('\n🎉 Test completed successfully!');
    } else {
        console.log('\n💥 Test failed!');
    }
    process.exit(success ? 0 : 1);
});