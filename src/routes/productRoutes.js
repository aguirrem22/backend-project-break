const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController.js");
const isAdmin = require("../middlewares/authMiddleware.js");

router.use(isAdmin);

router.get("/login", (req, res) => {
    req.session.isAdmin = true;
    res.redirect("/dashboard");
});

router.get("/logout", (req, res) => {
    req.session.isAdmin = false;
    res.redirect("/products");
});

router.get("/products", productController.showProducts);
router.get("/products/:id", productController.showProductById);

router.get("/dashboard", productController.showProducts);
router.post("/dashboard", productController.createProduct);
router.get("/dashboard/new", productController.showNewProduct);
router.get("/dashboard/:id", productController.showProductById);
router.get("/dashboard/:id/edit", productController.showEditProduct);
router.put("/dashboard/:id", productController.updateProduct);
router.delete("/dashboard/:id/delete", productController.deleteProduct);

router.use((req, res) => {
    res.status(404).send(`hola mundo`);
});

module.exports = router;