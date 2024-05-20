const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const { v4: uuidv4 } = require('uuid');

const ForgotPasswordRequest = sequelize.define('forgotpasswordrequest', {
  id: {
    type: Sequelize.UUID,
    defaultValue: uuidv4,
    allowNull: false,
    primaryKey: true
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

module.exports = ForgotPasswordRequest;
