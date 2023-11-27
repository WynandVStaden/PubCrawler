const {STRING} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    return sequelize.define("note", {
        title: {
            type: STRING,
            primaryKey: true,
            allowNull: false,
        },
        content: {
            type: STRING
        }
    }, {},
    );
};
