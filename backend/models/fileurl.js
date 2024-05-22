const Sequelize = require('sequelize');

const sequelize = require("../utils/database");

const FileURL = sequelize.define('fileurl',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
    url :{
        type : Sequelize.STRING,
        allowNull : false
    }
})

module.exports = FileURL;