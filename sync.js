const sequelize         = require("./src/api/config/database");
const Category          = require("./src/api/models/category");
const Category_products = require("./src/api/models/category_products");
const Product           = require("./src/api/models/product");
const ProductImage     = require("./src/api/models/product_image"); // Renamed for consistency
const ProductOptions    = require("./src/api/models/Product_options"); // Corrected typo
const Users             = require("./src/api/models/users");

async function syncDatabase() {
    try {
        // It's crucial to load all models and their associations *before* calling sequelize.sync()
        // The associations are already defined in the respective model files (e.g., product.js).
        // Redefining them here can lead to conflicts or unexpected behavior.
        // The purpose of sync.js should primarily be to synchronize the database schema.

        // Ensure all models are loaded so their associations are registered with Sequelize
        // (They are already imported at the top, which is good)

        // Define associations if they are NOT defined in the model files themselves.
        // However, based on product.js, they *are* defined there.
        // So, these lines below are redundant and potentially conflicting if they differ.
        // If product.js is the source of truth for associations, these should be removed.
        // Assuming product.js is the source of truth, these lines are commented out/removed.
        /*
        Product.hasMany(ProductImage, { foreignKey: "product_id", as: 'images' });
        Product.hasMany(ProductOptions, { foreignKey: "product_id", as: 'options' });
        // For Many-to-Many, the `belongsToMany` in Product.js handles the junction table.
        // No need to define Category_products associations here.
        Product.belongsToMany(Category, { through: "category_products", foreignKey: "product_id", otherKey: "category_id", as: "categories" });
        */

        // The Product model already defines the associations:
        // Product.hasMany(ProductImage, { as: 'images', foreignKey: 'product_id' });
        // Product.hasMany(ProductOptions, { as: 'options', foreignKey: 'product_id' });
        // Product.belongsToMany(Category, { as: 'categories', through: 'category_products', foreignKey: 'product_id', otherKey: 'category_id' });

        // Ensure the Category_products model is also loaded if it's a separate file
        // (It is, and it's imported at the top)

        await sequelize.sync({ force: true }); // `force: true` will drop existing tables
        console.log("Banco de dados sincronizado com sucesso.");

        // Example of creating a product and associating it with a category
        // You would typically create categories first.
        const newCategory = await Category.create({
            name: "Eletrônicos",
            slug: "eletronicos",
            use_in_menu: true
        });

        const createProduct = await Product.create(
        {
            enabled: true,
            name: "Notebook Sony Vaio",
            slug: "notebook-sony-vaio", // Slugs should be unique and descriptive
            use_in_menu: false,
            stock: 100,
            description: "Notebook 16pol HD1T 4GB",
            price: 3500.00,
            price_with_discount: 2950
        });

        // Associate the product with the created category
        await createProduct.addCategory(newCategory); // Use the singular form 'addCategory' for belongsToMany

        // Example of adding an image
        await ProductImage.create({
            product_id: createProduct.id,
            enable: true,
            path: "/images/notebook-sony-vaio-1.jpg"
        });

        // Example of adding an option
        await ProductOptions.create({
            product_id: createProduct.id,
            title: "Cor",
            shape: "square",
            type: "color",
            values: "red,blue,black"
        });

        console.log("Produto, categoria, imagem e opção de exemplo criados e associados com sucesso!");

    } catch (error) {
        console.error("Erro ao sincronizar o banco de dados:", error);
    }
}

syncDatabase();

module.exports = sequelize;