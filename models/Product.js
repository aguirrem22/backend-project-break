const mongoose = require('mongoose');

const Categories = ['Camisetas', 'Pantalones', 'Zapatos', 'Accesorios'];
const Sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '38', '40', '42', '44'];

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: Categories,
    required: true,
  },
  size: {
    type: String,
    enum: Sizes,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = { Product, Categories, Sizes };