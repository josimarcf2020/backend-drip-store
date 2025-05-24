const Category = require('../api/models/category');

// Listar todas as categorias
const getCategory = async(req, res) => {

    try {
        const categories = await Category.findAll({
            order: [['name', 'ASC']]
        });
        res.status(200).json(categories);

    }catch (error) {
        console.error("Erro ao buscar categorias:", error.message);
        res.status(500).json({message: "Erro ao buscar categorias", error: error.message});
    }
};

// Buscar categoria por ID
const getCategoryById = async(req, res) => {

    try {
        const {id} = req.params;
        const category = await Category.findByPk(id);
        if(!category){
            return res.status(404).json({message: "Categoria não encontrada"});
        }
        res.status(200).json(category);

    }catch (error) {
        console.error(`Erro ao buscar categoria com id ${id}:`, error.message);
        res.status(500).json({message: `Erro ao buscar categoria com id ${id}`, error: error.message});
    }
};

// Criar uma nova categoria
const createCategory = async(req, res) => {
    // Assuming 'use_in_menu' is the corrected field name from the model
    const { name, slug, use_in_menu } = req.body;
    try {
        if (!name || !slug) {
            return res.status(400).json({ message: 'Nome e slug são obrigatórios.' });
        }

        const newCategory = await Category.create({
            name,
            slug,
            use_in_menu // Sequelize will use defaultValue if undefined
        });
        res.status(201).json({ message: 'Categoria criada com sucesso!', category: newCategory });
    }catch (error) {
        console.error("Erro ao criar categoria:", error.message);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors ? error.errors.map(e => ({ field: e.path, message: e.message })) : [{ message: error.message }];
            return res.status(400).json({ message: 'Erro de validação ao criar categoria.', errors });
        }
        res.status(500).json({message: "Erro interno ao criar categoria", error: error.message});
    }
};

// Atualizar uma categoria existente
const updateCategory = async(req, res) => {
    const { id } = req.params;
    const { name, slug, use_in_menu } = req.body;

    const updatePayload = {};
    if (name !== undefined) updatePayload.name = name;
    if (slug !== undefined) updatePayload.slug = slug;
    if (use_in_menu !== undefined) updatePayload.use_in_menu = use_in_menu; // Corrected field name

    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({message: "Categoria não encontrada"});
        }

        if (Object.keys(updatePayload).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }

        const [updatedRowsCount] = await Category.update(updatePayload, {
            where: { id }
        });

        if (updatedRowsCount === 0) {
            const currentCategory = await Category.findByPk(id);
            if (!currentCategory) return res.status(404).json({ message: 'Categoria não encontrada após tentativa de atualização.' });
            return res.status(200).json({ message: 'Nenhuma alteração aplicada à categoria (os dados podem ser os mesmos).', category: currentCategory });
        }

        const updatedCategory = await Category.findByPk(id);
        res.status(200).json({ message: 'Categoria atualizada com sucesso!', category: updatedCategory });

    }catch (error) {
        console.error(`Erro ao atualizar categoria com id ${id}:`, error.message);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors ? error.errors.map(e => ({ field: e.path, message: e.message })) : [{ message: error.message }];
            return res.status(400).json({ message: 'Erro de validação ao atualizar categoria.', errors });
        }
        res.status(500).json({message: `Erro ao atualizar categoria com id ${id}`, error: error.message});
    }
};

// Deletar uma categoria
const deleteCategory = async(req, res) => {
    try {
        const {id} = req.params;
        const deletedRowCount = await Category.destroy({
            where: { id }
        });

        if (deletedRowCount === 0) {
            return res.status(404).json({ message: 'Categoria não encontrada para deletar' });
        }
        // HTTP 204 No Content should not have a body.
        // If you want to send a message, use 200 OK.
        res.status(200).json({message: "Categoria deletada com sucesso!"});
        // Alternatively, for 204: res.status(204).send();

    }catch (error) {
        console.error("Erro ao deletar categoria", error);
        res.status(500).json({message: "Erro ao deletar categoria"});
    }
};


module.exports = {
    getCategory, 
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};