const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const Wishlist = sequelize.define('Wishlist', {
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
}, {
    timestamps: true,
});

module.exports = Wishlist;
