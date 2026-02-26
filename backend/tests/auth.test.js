const request = require('supertest');
const app = require('../index');
const { User, sequelize } = require('../models/index');

/**
 * Authentication CRUD Tests
 * 
 * These tests cover the user signup and signin flows.
 * We use a unique email for each test run to avoid conflicts.
 */

describe('Authentication API', () => {
    const testUser = {
        username: 'testuser_' + Date.now(),
        email: `test_${Date.now()}@example.com`,
        password: 'password123'
    };

    // Clean up or sync before tests if necessary
    // For these integration tests, we rely on the existing DB

    describe('POST /api/auth/signup', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send(testUser);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'User created successfully');
            expect(res.body).toHaveProperty('userId');
        });

        it('should not register a user with an existing email', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send(testUser);

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'User already exists');
        });
    });

    describe('POST /api/auth/signin', () => {
        it('should login successfully with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/signin')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('username', testUser.username);
        });

        it('should fail login with incorrect password', async () => {
            const res = await request(app)
                .post('/api/auth/signin')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Invalid credentials');
        });

        it('should fail login for non-existent user', async () => {
            const res = await request(app)
                .post('/api/auth/signin')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'User not found');
        });
    });
});
