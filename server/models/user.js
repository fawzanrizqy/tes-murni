'use strict';
const { hashPass } = require("../helpers/encryptor");
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "Email must be unique",
      validate: {
        isEmail: {
          msg: 'Email Must be in right format!',
        },
        notNull: {
          msg: 'Username Must be filled!',
        },
        notEmpty: {
          msg: 'Username Must be filled!',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password Must be filled!',
        },
        notEmpty: {
          msg: 'Password Must be filled!',
        },
        len: {
          args: [6],
          msg: 'Password must be at least 6 characters long!',
        },
      },
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Age Must be filled!',
        },
        notEmpty: {
          msg: 'Age Must be filled!',
        },
      },
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate((user) => {
    user.password = hashPass(user.password);
  })
  return User;
};