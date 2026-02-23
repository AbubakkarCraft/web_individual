const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const ReadingProgress = sequelize.define('ReadingProgress', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    bookId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    currentPage: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    lastRead: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true,
});

module.exports = ReadingProgress;
