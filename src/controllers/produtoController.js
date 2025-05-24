const Produto = require('../models/produto.js');

exports.listar = (req, res) => {
    res.status(200).json(Produto.listar());
};

exports.adicionar = (req, res) => {
    const novoProduto = req.body;
    Produto.adicionar(novoProduto);
    res.status(201).json({ message: 'Produto adicionado com sucesso!' });
};

exports.atualizar = (req, res) => {
    const id = req.params.id;
    const produtoAtualizado = req.body;
    Produto.atualizar(id, produtoAtualizado);
    res.status(200).json({ message: 'Produto atualizado com sucesso!' });
};

exports.remover = (req, res) => {
    const id = req.params.id;
    Produto.remover(id);
    res.status(200).json({ message: 'Produto removido com sucesso!' });
};
