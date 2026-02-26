const { sequelize } = require('../models/index');
require('dotenv').config();

// Ensure a consistent JWT_SECRET for tests
process.env.JWT_SECRET = 'test_secret_key_123';

/**
 * Global Test Setup
 * 
 * This script runs before all test suites.
 * It ensures the database is synced so that tables exist for integration tests.
 */
beforeAll(async () => {
    // Sync database to ensure tables exist
    await sequelize.sync({ alter: true });
    console.log('Test Database Synced');
});

afterAll(async () => {
    // Close connection after all tests
    await sequelize.close();
});
