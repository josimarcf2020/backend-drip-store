const Product = require('../api/models/product');
const Category = require('../api/models/category');
const ProductImage = require('../api/models/product_image');
const ProductOptions = require('../api/models/Product_options');
const sequelize = require('../api/config/database'); // Importa a instância do Sequelize para usar transações

/**
 * NOTA IMPORTANTE:
 * Para que a inclusão de dados ('include') e os campos virtuais funcionem corretamente,
 * as associações no modelo 'product.js' devem ser definidas com um alias ('as').
 * Exemplo em /models/product.js:
 *
 * Product.hasMany(ProductImage, { as: 'images', foreignKey: 'product_id' });
 * Product.hasMany(ProductOptions, { as: 'options', foreignKey: 'product_id' });
 * Product.belongsToMany(Category, { as: 'categories', through: 'category_products', ... });
 */

// Helper para reutilizar a configuração de 'include'
const getProductIncludes = () => [
    {
        model: Category,
        as: 'categories',
        through: { attributes: [] } // Oculta os atributos da tabela de junção
    },
    {
        model: ProductImage,
        as: 'productImages' // Match the alias in the Product model to avoid naming collisions.
    },
    {
        model: ProductOptions,
        as: 'productOptions' // Match the alias in the Product model.
    }
];

// Listar todos os produtos
const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: getProductIncludes(),
            order: [['id', 'DESC']]
        });
        res.status(200).json(products);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ message: 'Erro ao buscar produtos', error: error.message });
    }
};

// Buscar produto por ID
const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id, {
            include: getProductIncludes()
        });
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error(`Erro ao buscar produto com id ${id}:`, error);
        res.status(500).json({ message: 'Erro ao buscar produto', error: error.message });
    }
};

// Criar um novo produto
const createProduct = async (req, res) => {
    // O corpo da requisição agora pode incluir os dados das associações
    const { name, slug, enabled, use_in_menu, stock, description, price, price_with_discount, categoryIds, images, options } = req.body;
    const t = await sequelize.transaction();

    try {
        if (!name || !slug) {
            return res.status(400).json({ message: 'Nome e slug são obrigatórios.' });
        }

        // 1. Cria o produto dentro da transação
        const newProduct = await Product.create({
            name, slug, enabled, use_in_menu, stock, description, price, price_with_discount
        }, { transaction: t });

        // 2. Associa as categorias (Muitos-para-Muitos)
        if (categoryIds && categoryIds.length > 0) {
            await newProduct.setCategories(categoryIds, { transaction: t });
        }

        // 3. Cria e associa as imagens (Um-para-Muitos)
        if (images && images.length > 0) {
            const imagesToCreate = images.map(img => ({ ...img, product_id: newProduct.id }));
            await ProductImage.bulkCreate(imagesToCreate, { transaction: t });
        }

        // 4. Cria e associa as opções (Um-para-Muitos)
        if (options && options.length > 0) {
            const optionsToCreate = options.map(opt => ({ ...opt, product_id: newProduct.id }));
            await ProductOptions.bulkCreate(optionsToCreate, { transaction: t });
        }

        // Se tudo deu certo, confirma a transação
        await t.commit();

        // Busca o produto completo com todas as associações para retornar na resposta
        const finalProduct = await Product.findByPk(newProduct.id, {
            include: getProductIncludes()
        });

        res.status(201).json({ message: 'Produto criado com sucesso!', product: finalProduct });

    } catch (error) {
        // Se ocorrer qualquer erro, desfaz a transação
        await t.rollback();
        console.error('Erro ao criar produto:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Erro de validação', errors: error.errors.map(e => ({ field: e.path, message: e.message })) });
        }
        res.status(500).json({ message: 'Erro ao criar produto', error: error.message });
    }
};

// Atualizar um produto existente
const updateProduct = async (req, res) => {
    const { id } = req.params;
    // Separa os dados do produto dos dados das associações
    const { categoryIds, images, options, ...productData } = req.body;
    const t = await sequelize.transaction();

    try {
        // Valida se algum dado foi enviado para atualização
        if (Object.keys(req.body).length === 0) {
            await t.rollback();
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }

        const product = await Product.findByPk(id, { transaction: t });
        if (!product) {
            await t.rollback();
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        // 1. Atualiza os atributos do próprio produto
        if (Object.keys(productData).length > 0) {
            await product.update(productData, { transaction: t });
        }

        // 2. Atualiza as categorias (substitui todas as existentes)
        if (categoryIds) { // Permite passar um array vazio para remover todas as categorias
            await product.setCategories(categoryIds, { transaction: t });
        }

        // 3. Atualiza as imagens (destrutivo: remove todas as antigas e adiciona as novas)
        if (images) {
            await ProductImage.destroy({ where: { product_id: id }, transaction: t });
            if (images.length > 0) {
                const imagesToCreate = images.map(img => ({ ...img, product_id: id }));
                await ProductImage.bulkCreate(imagesToCreate, { transaction: t });
            }
        }

        // 4. Atualiza as opções (mesma lógica das imagens)
        if (options) {
            await ProductOptions.destroy({ where: { product_id: id }, transaction: t });
            if (options.length > 0) {
                const optionsToCreate = options.map(opt => ({ ...opt, product_id: id }));
                await ProductOptions.bulkCreate(optionsToCreate, { transaction: t });
            }
        }

        await t.commit();

        const updatedProduct = await Product.findByPk(id, {
            include: getProductIncludes()
        });

        res.status(200).json({ message: 'Produto atualizado com sucesso!', product: updatedProduct });

    } catch (error) {
        await t.rollback();
        console.error(`Erro ao atualizar produto com id ${id}:`, error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Erro de validação ao atualizar', errors: error.errors.map(e => ({ field: e.path, message: e.message })) });
        }
        res.status(500).json({ message: 'Erro ao atualizar produto', error: error.message });
    }
};

// Deletar um produto
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        // Para que as imagens e opções sejam deletadas em cascata,
        // a melhor abordagem é configurar 'ON DELETE CASCADE' na foreign key no banco de dados.
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado para deletar' });
        }
        
        await product.destroy(); // O Sequelize cuidará de remover as entradas na tabela de junção 'category_products'

        // HTTP 204 No Content é o status apropriado para uma exclusão bem-sucedida sem corpo de resposta.
        res.status(204).send();
    } catch (error) {
        console.error(`Erro ao deletar produto com id ${id}:`, error);
        res.status(500).json({ message: 'Erro ao deletar produto', error: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};