const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const Rating = sequelize.define('Rating', {
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
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    },
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['userId', 'bookId']
        }
    ]
});

module.exports = Rating;
