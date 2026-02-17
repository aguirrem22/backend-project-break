const express = require('express');
const {
	showProducts,
	showProductById,
	showDashboard,
	showNewProduct,
	createProduct,
	showDashboardProduct,
	showEditProduct,
	updateProduct,
	deleteProduct,
	getProductsApi,
	getProductByIdApi
} = require('../controllers/productController');
const { requireAuthApi, requireAuthDashboard } = require('../middlewares/authMiddleware');

const router = express.Router();
const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

router.get('/products', asyncHandler(showProducts));
router.get('/products/:productId', asyncHandler(showProductById));

router.get('/dashboard', requireAuthDashboard, asyncHandler(showDashboard));
router.get('/dashboard/new', requireAuthDashboard, asyncHandler(showNewProduct));
router.post('/dashboard', requireAuthDashboard, asyncHandler(createProduct));
router.get('/dashboard/:productId', requireAuthDashboard, asyncHandler(showDashboardProduct));
router.get('/dashboard/:productId/edit', requireAuthDashboard, asyncHandler(showEditProduct));
router.put('/dashboard/:productId', requireAuthDashboard, asyncHandler(updateProduct));
router.delete('/dashboard/:productId/delete', requireAuthDashboard, asyncHandler(deleteProduct));

router.get('/api/products', asyncHandler(getProductsApi));
router.get('/api/products/:productId', asyncHandler(getProductByIdApi));
router.post('/api/products', requireAuthApi, asyncHandler(createProduct));
router.put('/api/products/:productId', requireAuthApi, asyncHandler(updateProduct));
router.delete('/api/products/:productId', requireAuthApi, asyncHandler(deleteProduct));

module.exports = router;
