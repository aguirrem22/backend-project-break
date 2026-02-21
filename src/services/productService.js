function mapProductToCard(product) {
	return {
		id: product._id,
		nombre: product.nombre,
		precio: product.precio,
		imagen: product.imagen
	};
}

module.exports = {
	mapProductToCard
};