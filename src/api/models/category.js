const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

//Definindo modelo category
const Category = sequelize.define("category", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    use_in_menu: { // Corrected typo here
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    }
});

module.exports = Category;
