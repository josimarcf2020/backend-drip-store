const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../api/models/users');

const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            // Best practice: Never expose password hashes in API responses.
            attributes: { exclude: ['password'] },
            order: [
                ['id', 'ASC']
            ]   
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error.message);
        res.status(500).json({ message: 'Erro interno ao buscar usuários', error: error.message });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Users.findByPk(id, {
            // Best practice: Never expose password hashes in API responses.
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(`Erro ao buscar usuário com id ${id}:`, error.message);
        res.status(500).json({ message: `Erro interno ao buscar usuário com id ${id}`, error: error.message });
    }
};

const createUser = async (req, res) => {
    const { firstName, surName, email, password } = req.body;
    try {
        if (!firstName || !surName || !email || !password) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios: firstName, surName, email, password.' });
        }

        // Security: Hash the password securely with bcrypt.
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await Users.create({
            firstName,
            surName,
            email,
            password: hashedPassword,
        });

        // Best practice: Create a response object without the password.
        const userResponse = newUser.toJSON();
        delete userResponse.password;

        res.status(201).json({ message: 'Usuário criado com sucesso!', user: userResponse });
    } catch (error) {
        console.error('Erro ao criar usuário:', error.message);
         // Trata erros de validação e unicidade do Sequelize
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors ? error.errors.map(e => ({ field: e.path, message: e.message })) : [{ message: error.message }];
            return res.status(400).json({ message: 'Erro de validação ao criar usuário.', errors });
        }
        res.status(500).json({ message: 'Erro interno ao criar usuário', error: error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstName, surName, email, password } = req.body;

    const updatePayload = {};
    if (firstName !== undefined) updatePayload.firstName = firstName;
    if (surName !== undefined) updatePayload.surName = surName;
    if (email !== undefined) updatePayload.email = email;
    
    try {
        // Security: If password is being updated, hash it before saving.
        if (password) {
            updatePayload.password = await bcrypt.hash(password, 10);
        }

        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (Object.keys(updatePayload).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }

        const [updatedRowsCount] = await Users.update(updatePayload, {
            where: { id }
        });

        if (updatedRowsCount === 0) {
            const currentUser = await Users.findByPk(id, { attributes: { exclude: ['password'] } });
            if (!currentUser) return res.status(404).json({ message: 'Usuário não encontrado após tentativa de atualização.' });
            return res.status(200).json({ message: 'Nenhuma alteração aplicada ao usuário (os dados podem ser os mesmos).', user: currentUser });
        }

        const updatedUser = await Users.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
        res.status(200).json({ message: 'Usuário atualizado com sucesso!', user: updatedUser });
    } catch (error) {
        console.error(`Erro ao atualizar usuário com id ${id}:`, error.message);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors ? error.errors.map(e => ({ field: e.path, message: e.message })) : [{ message: error.message }];
            return res.status(400).json({ message: 'Erro de validação ao atualizar usuário.', errors });
        }
        res.status(500).json({ message: `Erro interno ao atualizar usuário com id ${id}`, error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRowCount = await Users.destroy({
            where: { id }
        });

        if (deletedRowCount === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado para deletar' });
        }

        // Best practice: Use 204 No Content for successful deletions with no response body.
        res.status(204).send();
    } catch (error) {
        console.error(`Erro ao deletar usuário com id ${id}:`, error.message);
        res.status(500).json({ message: `Erro interno ao deletar usuário com id ${id}`, error: error.message });
    }
};

const loginUser = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: user.id }, process.env.APP_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login bem-sucedido', token });
    } catch (error) {
        console.error('Erro ao fazer login:', error.message);
        res.status(500).json({ message: 'Erro interno ao fazer login', error: error.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser
};
