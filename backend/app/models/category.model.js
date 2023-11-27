const {STRING} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    return sequelize.define("category", {
        title: {
            type: STRING,
            allowNull: false,
        },
        type: {
            type: STRING,
            allowNull: false
        }
    }, {timestamps : false}
    );
};
