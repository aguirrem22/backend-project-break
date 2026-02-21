const { Product } = require("../models/Product.js");
const baseHtml = require("../helpers/baseHtml.js");
const getNavBar = require("../helpers/getNavBar.js");
const { renderProductCards, renderProductForm, renderProductDetail } = require("../helpers/template.js");

const productController = {
    createProduct: async (req, res) => {
        try {
            const product = await Product.create(req.body);
            res.status(201).send(product);
        } catch (error) {
            console.log(error);
            res.status(501).send({message: "There was a problem trying to create the product"});
        }
    },
    showNewProduct: async (req, res) => {
        try {
            if (res.isAdmin) {
                const html = baseHtml("Crear Producto", getNavBar(true) + renderProductForm(null, "/dashboard"));
                res.send(html);
            } else {
                res.redirect("/products");
            }
        } catch (error) {
            console.log(error);
            res.status(501).send({message: "There was a problem trying to get all products"});
        }
    },
    getProducts: async (req, res) => {
        try {
            const products = await Product.find();
            res.status(201).json(products);
        } catch (error) {
            console.log(error);
            res.status(501).send({message: "There was a problem trying to get all products"});
        }
    },
    showProducts: async (req, res) => {
        try {
            let products;
            if (req.query.category) {
                products = await Product.find({categoria: req.query.category});
            } else {
                products = await Product.find();
            }
            const productCards = renderProductCards(products);
            const html = baseHtml("Products", getNavBar(req.isAdmin) + productCards);
            res.send(html);
        } catch (error) {
            console.log(error);
            res.status(501).send({message: "There was a problem trying to get all products"});
        }
    },
    getProductById: async (req, res) => {
        const id = req.params.id;
        try {
            const product = await Product.findById(id);
            if (!product) {
                res.status(404).send({message: "There is no product with that id"});
            }
            res.status(201).send(product);
        } catch (error) {
            console.log(error);
            res.status(501).send({message: "There was a problem trying to get the product"});
        }
    },
    showProductById: async (req, res) => {
        const id = req.params.id;
        try {
            const product = await Product.findById(id);
            if (!product) {
                res.status(404).send({message: "There is no product with that id"});
            }
            if (req.isAdmin) {
                const html = baseHtml("Producto", getNavBar(true) + renderProductDetail(product, true));
                res.send(html);
            } else {
                const html = baseHtml("Producto", getNavBar() + renderProductDetail(product));
                res.send(html);
            }
        } catch (error) {
            console.log(error);
            res.status(501).send({message: "There was a problem trying to get the product"});
        }
    },
    updateProduct: async (req, res) => {
        const id = req.params.id;
        try {
            const task = await Product.findByIdAndUpdate(id, req.body);
            if (!task) {
                res.status(404).send({message: "There is no product with that id"});
            }
            const updatedProduct = await Product.findById(id);
            res.status(201).send(updatedProduct);
        } catch (error) {
            console.log(error);
            res.status(501).send({message: "There was a problem trying to update the product"});
        }
    },
    showEditProduct: async (req, res) => {
        const id = req.params.id;
        try {
            if (req.isAdmin) {
                const product = await Product.findById(id);
                const html = baseHtml("Editar Producto", getNavBar(true) + renderProductForm(product, "/dashboard"));
                res.send(html);
            } else {
                res.redirect("/products");
            }
        } catch (error) {
            console.log(error);
            res.status(501).send({message: "There was a problem trying to get all products"});
        }
    },
    deleteProduct: async (req, res) => {
        const id = req.params.id;
        try {
            const product = await Product.findById(id);
            if (!product) {
                res.status(404).send({message: "There is no product with that id"});
            }
            const deleteCount = await Product.deleteOne({_id: id});
            res.status(201).send({message: "Product successfully deleted", deleteCount: deleteCount});
        } catch (error) {
            console.log(error);
            res.status(501).send({message: "There was a problem trying to delete the product"});
        }
    },
};

module.exports = productController;