const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    recommend: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    bookId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
}, {
    timestamps: true,
});

module.exports = Review;
