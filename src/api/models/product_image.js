const { DataTypes } = require("sequelize");
const product = require("./product");
const sequelize = require("../config/database");

//Definindo modelo category
const Product_image = sequelize.define("product_image", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      foreign_key: true,
      references: {
        model: product,
        key: "id",
      },
      allowNull: true,
      defaultValue: -1,
    },
    enable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    }
});

module.exports = Product_image;