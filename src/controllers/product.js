const Product = require('../api/models/product'); // Importa o modelo Sequelize Product

// Listar todos os produtos
const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            order: [['id', 'DESC']] // Ordena por ID de forma descendente
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
        const product = await Product.findByPk(id); // Busca pela chave primária
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
    // Extrai todos os campos relevantes do corpo da requisição
    const { name, slug, enabled, use_in_menu, stock, description, price, price_with_discount } = req.body;

    try {
        // Validação básica de campos obrigatórios (exemplo)
        if (!name || !slug) {
            return res.status(400).json({ message: 'Nome e slug são obrigatórios.' });
        }

        const newProduct = await Product.create({
            name,
            slug,
            enabled,
            use_in_menu,
            stock,
            description,
            price,
            price_with_discount
        });
        res.status(201).json({ message: 'Produto criado com sucesso!', product: newProduct });
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        // Trata erros de validação do Sequelize
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Erro de validação', errors: error.errors.map(e => e.message) });
        }
        res.status(500).json({ message: 'Erro ao criar produto', error: error.message });
    }
};

// Atualizar um produto existente
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        // O método update retorna um array com o número de linhas afetadas
        const [updatedRowsCount] = await Product.update(updateData, {
            where: { id }
        });

        // Se nenhuma linha foi atualizada, mas dados foram enviados, pode ser que os dados eram os mesmos
        // ou o produto foi deletado concorrentemente.
        if (updatedRowsCount === 0 && Object.keys(updateData).length > 0) {
            const currentProduct = await Product.findByPk(id); // Re-verifica se o produto ainda existe
            if (!currentProduct) return res.status(404).json({ message: 'Produto não encontrado após tentativa de atualização.' });
            return res.status(200).json({ message: 'Nenhuma alteração aplicada ao produto (dados podem ser os mesmos).', product: currentProduct });
        }
        
        const updatedProduct = await Product.findByPk(id); // Busca o produto atualizado para retornar
        res.status(200).json({ message: 'Produto atualizado com sucesso!', product: updatedProduct });

    } catch (error) {
        console.error(`Erro ao atualizar produto com id ${id}:`, error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Erro de validação ao atualizar', errors: error.errors.map(e => e.message) });
        }
        res.status(500).json({ message: 'Erro ao atualizar produto', error: error.message });
    }
};

// Deletar um produto
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRowCount = await Product.destroy({
            where: { id }
        });
        if (deletedRowCount === 0) {
            return res.status(404).json({ message: 'Produto não encontrado para deletar' });
        }
        res.status(200).json({ message: 'Produto deletado com sucesso!' }); // Pode usar 204 No Content se preferir não enviar corpo
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