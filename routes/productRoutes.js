const express = require('express');
const {
	showProducts,
	showProductById,
	showDashboard,
	showDashboardProduct,
	showNewProduct,
	createProduct,
	showEditProduct,
	updateProduct,
	deleteProduct,
} = require('../controllers/productController');
const requireAuth = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/products', showProducts);
router.get('/products/:productId', showProductById);

router.get('/dashboard', requireAuth, showDashboard);
router.get('/dashboard/new', requireAuth, showNewProduct);
router.post('/dashboard', requireAuth, createProduct);
router.get('/dashboard/:productId', requireAuth, showDashboardProduct);
router.get('/dashboard/:productId/edit', requireAuth, showEditProduct);
router.put('/dashboard/:productId', requireAuth, updateProduct);
router.post('/dashboard/:productId', requireAuth, updateProduct);
router.delete('/dashboard/:productId/delete', requireAuth, deleteProduct);

module.exports = router;
