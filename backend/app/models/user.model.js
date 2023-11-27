const {STRING} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  return sequelize.define("user", {
    username: {
      type: STRING,
      allowNull: false,
      primaryKey: true,
    },
    password: {
      type: STRING,
      allowNull: false
    },
    email: {
      type: STRING,
      allowNull: false,
      unique: true
    },
    avatar: {
      type: STRING,
    }
  }, {timestamps : false}
  );
};
