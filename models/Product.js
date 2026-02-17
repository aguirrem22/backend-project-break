const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		description: {
			type: String,
			required: true,
			trim: true
		},
		image: {
			type: String,
			required: true,
			trim: true
		},
		category: {
			type: String,
			required: true,
			enum: ['Camisetas', 'Pantalones', 'Zapatos', 'Accesorios']
		},
		size: {
			type: String,
			required: true,
			enum: ['XS', 'S', 'M', 'L', 'XL']
		},
		price: {
			type: Number,
			required: true,
			min: 0
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Product', productSchema);
