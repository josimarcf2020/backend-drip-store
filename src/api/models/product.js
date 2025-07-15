const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// It's good practice to import models for associations at the top.
const Category = require("./category");
const ProductImage = require("./product_image");
const ProductOptions = require("./Product_options");

//Definindo modelo Product
const Product = sequelize.define(
  "product",
  // Attributes
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false, // It's better to have a non-nullable boolean with a default.
      defaultValue: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Slugs should be unique to avoid conflicts in URLs.
    },
    use_in_menu: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false, // Stock count should ideally not be null.
      defaultValue: 0,
    },
    description: {
      type: DataTypes.TEXT, // Use TEXT for potentially long descriptions. STRING is limited (e.g., 255 chars).
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false, // A product should have a price.
      defaultValue: 0.0,
    },
    price_with_discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // This can be null if there is no discount.
    },
    images: {
      type: DataTypes.VIRTUAL, // This is a virtual field, not stored in the database.
      get() {
        // Use `getDataValue` to access the associated data without triggering the getter again,
        // which would cause an infinite loop. The association is now aliased as 'productImages'.
        const productImages = this.getDataValue('productImages');
        return productImages ? productImages.map((image) => image.path) : [];
      },
    },
    options: {
      type: DataTypes.VIRTUAL, // This is a virtual field, not stored in the database.
      get() {
        // Similarly, use `getDataValue` for the 'productOptions' association to prevent recursion.
        const productOptions = this.getDataValue('productOptions');
        return productOptions
          ? productOptions.map((option) => ({
          id: option.id,
          title: option.title,
          shape: option.shape,
          radius: option.radius,
          type: option.type,
          values: option.values,
        }))
          : [];
      },
    },
  },
  // Options
  {
    timestamps: true, // This correctly enables createdAt and updatedAt fields.
    tableName: 'products' // Good practice to explicitly define table name
  }
);
  
// Define as associações entre os modelos
// It's a good practice to define associations after all models have been defined.
// Ideally, this is done in a central file (e.g., src/api/models/index.js) to avoid circular dependencies.
// Um produto pode ter muitas imagens (Relação Um-para-Muitos).
Product.hasMany(ProductImage, {
  foreignKey: "product_id",
  as: "productImages", // Renamed to avoid collision with the 'images' virtual attribute.
});

// Um produto pode ter muitas opções (Relação Um-para-Muitos).
Product.hasMany(ProductOptions, {
  foreignKey: "product_id",
  as: "productOptions", // Adicionado para corresponder ao 'include' e ao campo virtual.
});

Product.belongsToMany(Category, {
  through: "category_products",
  foreignKey: "product_id",
  otherKey: "category_id",
  as: "categories",
});

module.exports = Product;