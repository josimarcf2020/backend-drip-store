const Product_image = require('../api/models/product_image');

// Listar todas as imagens de produtos
const getProductImages = async (req, res) => {
    try {
        const productImages = await Product_image.findAll({
            order: [['id', 'DESC']]
        });
        res.status(200).json(productImages);
    } catch (error) {
        console.error( "Erro ao buscar as imagens dos produtos:", error.message );
        res.status(500).json({ message: 'Erro ao buscar as imagens dos produtos', error: error.message });
    }
};

// Buscar imagem de produto por ID
const getProductImageById = async (req, res) => {
    try {
        const { id } = req.params;
        const productImage = await Product_image.findByPk(id);

        if (!productImage) {
            return res.status(404).json({ message: 'Imagem do produto não encontrada' });
        }

        res.status(200).json(productImage);
    } catch (error) {
        console.error( `Erro ao buscar a imagem do produto com id ${req.params.id}:`, error.message);
        res.status(500).json({ message: 'Erro ao buscar a imagem do produto', error: error.message });
    }
}

// Criar uma nova imagem de produto
const createProductImage = async (req, res) => {
    // O modelo usa 'enable', não 'enabled'. Ajustar se 'enabled' for intencional do frontend.
    const { product_id, enable, path } = req.body;
    try {
        if (!product_id || !path) {
            return res.status(400).json({ message: 'Dados incompletos: product_id e path são obrigatórios.' });
        }

        const newProductImage = await Product_image.create({
            product_id,
            enable, // Usar 'enable' para corresponder ao modelo
            path
        });
        res.status(201).json({ message: 'Imagem do produto criada com sucesso', productImage: newProductImage});
    } catch (error) {
        console.error( "Erro ao criar a imagem do produto:", error.message);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
            const errors = error.errors ? error.errors.map(e => ({ field: e.path, message: e.message })) : [{ message: error.message }];
            return res.status(400).json({ message: 'Erro de validação ao criar imagem do produto.', errors });
        }
        res.status(500).json({ message: 'Erro interno ao criar a imagem do produto', error: error.message });
    }
};

// Atualizar uma imagem de produto existente
const updateProductImage = async (req, res) => {
    const { id } = req.params;
    // O modelo usa 'enable'.
    const { product_id, enable, path } = req.body;

    try {
        const productImage = await Product_image.findByPk(id);

        if (!productImage) {
            return res.status(404).json({ message: 'Imagem do produto não encontrada' });
        }

        const updatePayload = {};
        if (product_id !== undefined) updatePayload.product_id = product_id;
        if (enable !== undefined) updatePayload.enable = enable; // Usar 'enable'
        if (path !== undefined) updatePayload.path = path;

        if (Object.keys(updatePayload).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }

        const [updatedRowsCount] = await Product_image.update(updatePayload, {
            where: { id }
        });

        if (updatedRowsCount === 0) {
            const currentImage = await Product_image.findByPk(id);
            if (!currentImage) return res.status(404).json({ message: 'Imagem do produto não encontrada após tentativa de atualização.' });
            return res.status(200).json({ message: 'Nenhuma alteração aplicada à imagem do produto (os dados podem ser os mesmos).', productImage: currentImage });
        }
        
        const updatedProductImage = await Product_image.findByPk(id);
        res.status(200).json({ message: 'Imagem do produto atualizada com sucesso', productImage: updatedProductImage });
    } catch (error) {
        console.error( `Erro ao atualizar a imagem do produto com id ${id}:`, error.message);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
            const errors = error.errors ? error.errors.map(e => ({ field: e.path, message: e.message })) : [{ message: error.message }];
            return res.status(400).json({ message: 'Erro de validação ao atualizar imagem do produto.', errors });
        }
        res.status(500).json({ message: `Erro interno ao atualizar a imagem do produto com id ${id}`, error: error.message });
    }
};

// Deletar uma imagem de produto
const deleteProductImage = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRowCount = await Product_image.destroy({
            where: { id }
        });

        if (deletedRowCount === 0) {
            return res.status(404).json({ message: 'Imagem do produto não encontrada para deletar' });
        }
        res.status(200).json({ message: 'Imagem do produto deletada com sucesso' }); // Pode usar 204 No Content se preferir
    } catch (error) {
        console.error( `Erro ao deletar a imagem do produto com id ${id}:`, error.message);
        res.status(500).json({ message: `Erro interno ao deletar a imagem do produto com id ${id}`, error: error.message });
    }
};

module.exports = {
    getProductImages,
    getProductImageById,
    createProductImage,
    updateProductImage,
    deleteProductImage
};