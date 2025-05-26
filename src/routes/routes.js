const express                   = require('express');
const router                    = express.Router();
const productController         = require('../controllers/product');
const categoryController        = require('../controllers/category');
const userController            = require('../controllers/users');
const productImageController    = require('../controllers/product_image'); // Renomeado para consistência

// Define routes using the Express router
// These routes will be relative to where this router is mounted.
// For example, if mounted on '/api', GET '/api/produtos' will trigger productController.getProducts.
// ********************** PRODUTOS ************************
router.get('/v1/product/search', productController.getProducts);
router.post('/v1/product/', productController.createProduct);
// Routes that operate on a specific product by ID
router.get('/v1/product/:id', productController.getProductById);
router.put('/v1/product/:id', productController.updateProduct);
router.delete('/v1/product/:id', productController.deleteProduct);

// ************************* USUARIOS *******************************
router.get('/v1/user/search', userController.getUsers);
router.post('/v1/user/', userController.createUser);
// Routes that operate on a specific user by ID
router.get('/v1/user/:id', userController.getUserById);
router.put('/v1/user/:id', userController.updateUser);
router.delete('/v1/user/:id', userController.deleteUser);

//************************* CATEGORIAS ****************************** */
router.get('/v1/category/search', categoryController.getCategory);
router.post('/v1/category', categoryController.createCategory);
// Routes that operate on a specific category id
router.get('/v1/category/:id', categoryController.getCategoryById);
router.put('/v1/category/:id', categoryController.updateCategory);
router.delete('/v1/category/:id', categoryController.deleteCategory);

//************************ IMAGENS DE PRODUTO *****************************/
router.get('/imagens-produto', productImageController.getProductImages); // Caminho e função atualizados
router.post('/imagens-produto', productImageController.createProductImage); // Caminho e função atualizados
// Routes that operate on a specific product image id
router.get('/imagens-produto/:id', productImageController.getProductImageById); // Caminho e função atualizados
router.put('/imagens-produto/:id', productImageController.updateProductImage); // Caminho e função atualizados
router.delete('/imagens-produto/:id', productImageController.deleteProductImage); // Caminho e função atualizados

module.exports = router;
