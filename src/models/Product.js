const mongoose = require('mongoose');

const Categories = ['Camisetas', 'Pantalones', 'Zapatos', 'Accesorios'];
const Sizes = ['XS', 'S', 'M', 'L', 'XL'];

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
  },
  imagen: {
    type: String,
    required: true,
    trim: true,
  },
  categoria: {
    type: String,
    enum: Categories,
    required: true,
  },
  talla: {
    type: String,
    enum: Sizes,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
    min: 0,
  },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = { Product, Categories, Sizes };