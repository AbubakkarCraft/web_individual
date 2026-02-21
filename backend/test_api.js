const axios = require('axios');

async function test() {
    try {
        console.log('Testing Signup endpoint...');
        const response = await axios.post('http://localhost:5001/api/auth/signup', {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

test();
