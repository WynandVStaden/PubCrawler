const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.notes = require("./note.model.js")(sequelize, Sequelize);
db.categories = require("./category.model.js")(sequelize, Sequelize);
db.userNoteRelationShip = require("./UserNoteRelationship.model.js")(sequelize, Sequelize);

/* Many-to-Many relationship between users and notes*/
db.users.belongsToMany(db.notes, {through: db.userNoteRelationShip, foreignKey: 'username'})
db.notes.belongsToMany(db.users, {through: db.userNoteRelationShip, foreignKey: 'title'})

/* Many-to-One relationship between notes and categories*/
db.categories.hasMany(db.notes, {foreignKey: 'categoryID'});
db.notes.belongsTo(db.categories, {foreignKey: 'categoryID'});

module.exports = db;
