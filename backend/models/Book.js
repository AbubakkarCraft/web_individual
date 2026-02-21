const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const Book = sequelize.define('Book', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    coverImage: {
        type: DataTypes.STRING,
    },
    category: {
        type: DataTypes.STRING,
    },
    content: {
        type: DataTypes.JSON, // Array of strings representing pages
    },
}, {
    timestamps: true,
});

module.exports = Book;
