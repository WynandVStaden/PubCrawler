const Sequelize = require('sequelize');
const {INTEGER, STRING, BOOLEAN} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user_note_relationship', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: STRING, // Change the data type if necessary
            allowNull: false, // Adjust allowNull based on your requirements
        },
        username: {
            type: STRING, // Change the data type if necessary
            allowNull: false, // Adjust allowNull based on your requirements
        },
        isShared: {
            type: BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {timestamps: false});
};