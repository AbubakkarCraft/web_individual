const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_name || 'BookhiveDB',
    process.env.DB_user || 'postgres',
    process.env.DB_password || 'root',
    {
        host: process.env.DB_host || 'localhost',
        port: process.env.DB_port || 5432,
        dialect: 'postgres',
        logging: false,
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connected via Sequelize');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, connectDB };
