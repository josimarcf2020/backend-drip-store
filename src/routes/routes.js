const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const categoryController = require('../controllers/category');
const userController = require('../controllers/users');

// Define routes using the Express router
// These routes will be relative to where this router is mounted.
// For example, if mounted on '/api', GET '/api/produtos' will trigger productController.getProducts.
// ********************** PRODUTOS ************************
router.get('/produtos', productController.getProducts);
router.post('/produtos', productController.createProduct);
// Routes that operate on a specific product by ID
router.get('/produtos/:id', productController.getProductById);
router.put('/produtos/:id', productController.updateProduct);
router.delete('/produtos/:id', productController.deleteProduct);

// ************************* USUARIOS *******************************
router.get('/usuarios', userController.getUsers);
router.post('/usuarios', userController.createUser);
// Routes that operate on a specific user by ID
router.get('/usuarios/:id', userController.getUserById);
router.put('/usuarios/:id', userController.updateUser);
router.delete('/usuarios/:id', userController.deleteUser);

//************************* CATEGORIAS ****************************** */
router.get('/categorias', categoryController.getCategory);
router.post('/categorias', categoryController.createCategory);
// Routes that operate on a  specific catgory id
router.get('/categorias/:id', categoryController.getCategoryById);
router.put('/categorias/:id', categoryController.updateCategory);
router.delete('/categorias/:id', categoryController.deleteCategory);

module.exports = router;
