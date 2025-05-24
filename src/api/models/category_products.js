const { DataTypes } = require("sequelize");
const Categories = require("./category");
const Product = require("./product");
const sequelize = require("../config/database");

//Definindo modelo category e produtos
const Category_products = sequelize.define("category_products", {
    category_id: {
      type: DataTypes.INTEGER,
      foreign_key: true, 
      references: { model: Categories, key: "id" },
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      foreign_key: true,
      references: { model: Product, key: "id" },
      allowNull: false,
    }

});

module.exports = Category_products;