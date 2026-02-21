function mapProductToCard(product) {
	return {
		id: product._id,
		name: product.name,
		price: product.price,
		image: product.image
	};
}

module.exports = {
	mapProductToCard
};