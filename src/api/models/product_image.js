const { DataTypes } = require("sequelize");
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
      references: {
        model: "products", // Use table name as a string to avoid circular dependency
        key: "id",
        alias: "productImages", // Alias for the association
      },
      allowNull: false, // Uma imagem de produto deve sempre estar associada a um produto.
      // defaultValue: -1 removido, pois product_id não pode ser nulo.
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