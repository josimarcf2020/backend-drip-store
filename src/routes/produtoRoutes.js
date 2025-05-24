const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController.js');

router.get('/', produtoController.listar);
router.post('/', produtoController.adicionar);
router.put('/:id', produtoController.atualizar);
router.delete('/:id', produtoController.remover);

module.exports = router;