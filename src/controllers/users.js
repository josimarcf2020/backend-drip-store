const Users = require('../api/models/users');

const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            order: [
                ['id', 'ASC']
            ]   
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(`Erro ao buscar usuário com id ${id}:`, error);
        res.status(500).json({ error: `Erro ao buscar usuário com id ${id}` });
    }
};

const createUser = async (req, res) => {
    const { firstname, surname, email, password } = req.body; 
    try {
        if (!firstname || !surname || !email || !password) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios: firstname, surname, email, password.' });
        }

        const newUser = await Users.create({
            firstName: firstname, // Mapeia para o campo 'firstName' do modelo
            surName: surname,     // Mapeia para o campo 'surName' do modelo
            email: email,
            password: password 
        });
        res.status(201).json({ message: 'Usuário criado com sucesso!', user: newUser });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
         // Trata erros de validação e unicidade do Sequelize
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors ? error.errors.map(e => ({ field: e.path, message: e.message })) : [{ message: error.message }];
            return res.status(400).json({ message: 'Erro de validação ao criar usuário.', errors });
        }
        res.status(500).json({ error: 'Erro interno ao criar usuário', error: error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstname, surname, email, password } = req.body;

     // Constrói o objeto de atualização apenas com os campos fornecidos
    const updatePayload = {};
    if (firstname !== undefined) updatePayload.firstName = firstname; // Mapeia para o campo 'firstName' do modelo
    if (surname !== undefined) updatePayload.surName = surname;     // Mapeia para o campo 'surName' do modelo
    if (email !== undefined) updatePayload.email = email;
    if (password !== undefined) updatePayload.password = password; // Considere hashear a senha se estiver sendo atualizada
    
    try {
        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Verifica se há dados para atualizar
        if (Object.keys(updatePayload).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }

        const [updatedRowsCount] = await Users.update(updatePayload, {
            where: { id }
        });

        // Se nenhuma linha foi afetada, mas dados foram enviados, os dados podem ser os mesmos
        if (updatedRowsCount === 0) {
            const currentUser = await Users.findByPk(id); // Re-busca para retornar o estado atual
            if (!currentUser) return res.status(404).json({ message: 'Usuário não encontrado após tentativa de atualização.' }); // Segurança
            return res.status(200).json({ message: 'Nenhuma alteração aplicada ao usuário (os dados podem ser os mesmos).', user: currentUser });
        }

        const updatedUser = await Users.findByPk(id);
        res.status(200).json({ message: 'Usuário atualizado com sucesso!', user: updatedUser });
    } catch (error) {
        console.error(`Erro ao atualizar usuário com id ${id}:`, error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors ? error.errors.map(e => ({ field: e.path, message: e.message })) : [{ message: error.message }];
            return res.status(400).json({ message: 'Erro de validação ao atualizar usuário.', errors });
        }
        res.status(500).json({ message: `Erro ao atualizar usuário com id ${id}`, error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteRowCount = await Users.destroy({
            where: { id }
        });

        if (deleteRowCount === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error(`Erro ao deletar usuário com id ${id}:`, error);
        res.status(500).json({ error: `Erro ao deletar usuário com id ${id}` });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
