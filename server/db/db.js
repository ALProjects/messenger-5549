const Sequelize = require("sequelize");

/*
const db = new Sequelize(process.env.DATABASE_URL || "postgres://localhost:5432/messenger", {
  logging: false
});
*/

const sequelize = new Sequelize('messenger', 'aaron', 'psqlpass', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

module.exports = sequelize;
