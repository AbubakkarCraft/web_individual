const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const Note = sequelize.define('Note', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    bookId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = Note;
