const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense_db','root','manager',
{ dialect : 'mysql',host : 'localhost'});

module.exports = sequelize;