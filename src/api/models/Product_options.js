const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

//Definindo modelo category
const Product_options = sequelize.define("product_options", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "products", // Use table name as a string to avoid circular dependency
        key: "id",
      },
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shape: {
      type: DataTypes.ENUM("square", "circle"),
      allowNull: true,
      defaultValue: "square",
    },
    radius: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    type: {
      type: DataTypes.ENUM("text", "color"),
      allowNull: true,
      defaultValue: "text",
    },
    values: {
      type: DataTypes.STRING,
      allowNull: false,
    }

});

module.exports = Product_options;