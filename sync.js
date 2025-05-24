const sequelize         = require("./src/api/config/database");
const Category          = require("./src/api/models/category");
const Category_products = require("./src/api/models/category_products");
const Product           = require("./src/api/models/product");
const Product_image     = require("./src/api/models/product_image");
const Product_optios    = require("./src/api/models/Product_optios");
const Users             = require("./src/api/models/users");

async function syncDatabase() {
    try {
        Product.hasMany(Product_image, {
            foreignKey: "product_id"
        });
        Product.hasMany(Product_optios, {
            foreignKey: "product_id"
        });
        Product.belongsTo(Category, {
            foreignKey: "category_id"
        });
        Category_products.hasMany(Product, {
            foreignKey: "category_id"
        });
        Category_products.hasMany(Category, {
            foreignKey: "product_id"
        });
        
        await sequelize.sync({ force: true });
        console.log("Banco de dados sincronizado com sucesso.");
        const createProduct = await Product.create(
        {
            enabled: true,
            name: "Notebook Sony Vaio",
            slug: "X",
            use_in_menu: false,
            stock: 100,
            description: "Notebook 16pol HD1T 4GB",
            price: 3500.00,
            price_with_discount: 2950
        });
        
        console.log(createProduct);

    } catch (error) {
        console.error("Erro ao sincronizar o banco de dados:", error);
    }
}

syncDatabase();

module.exports = sequelize;