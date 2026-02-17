const categories = ['Camisetas', 'Pantalones', 'Zapatos', 'Accesorios'];
const sizes = ['XS', 'S', 'M', 'L', 'XL'];

function renderProductCards(products, isDashboard = false) {
	if (!products.length) {
		return '<p>No hay productos disponibles.</p>';
	}

	return `
	<section class="grid">
	${products
	.map(
	(product) => `
		<article class="card">
		<img src="${product.image}" alt="${product.name}" />
	<div class="card-body">
		<h3>${product.name}</h3>
		${isDashboard ? `<p class="muted">${product.category} · ${product.size}</p><p>${product.price.toFixed(2)} €</p>` : ''}
		<div class="row">
		<a class="btn-view" href="${isDashboard ? `/dashboard/${product._id}` : `/products/${product._id}`}">Ver</a>
		${
		isDashboard
		? `<a class="btn-edit" href="/dashboard/${product._id}/edit">Editar</a>
		<form action="/dashboard/${product._id}/delete?_method=DELETE" method="POST">
		<button type="submit" class="danger">Eliminar</button>
	</form>`
	: ''
	}
	</div>
	</div>
	</article> `).join('')}
	</section>`;
}

function renderProductForm({
	product,
	action,
	method = 'POST',
	title = 'Nuevo producto',
	buttonLabel = 'Guardar'
}) {
	const selectedCategory = product?.category || 'Camisetas';
	const selectedSize = product?.size || 'M';
	const methodOverride = method !== 'POST' ? `<input type="hidden" name="_method" value="${method}" />` : '';

	return `
		<section class="form-wrapper">
			<h1>${title}</h1>
			<form action="${action}" method="POST" class="stack">
				${methodOverride}
				<label>Nombre<input name="name" value="${product?.name || ''}" required /></label>
				<label>Descripción<textarea name="description" required>${product?.description || ''}</textarea></label>
				<label>Imagen (URL)<input name="image" type="url" value="${product?.image || ''}" required /></label>
				<label>Categoría
					<select name="category" required>
				${categories
				.map((category) => `<option value="${category}" ${selectedCategory === category ? 'selected' : ''}>${category}</option>`)
				.join('')}
					</select>
				</label>
				<label>Talla
					<select name="size" required>
						${sizes
							.map((size) => `<option value="${size}" ${selectedSize === size ? 'selected' : ''}>${size}</option>`)
							.join('')}
					</select>
				</label>
				<label>Precio<input name="price" type="number" min="0" step="0.01" value="${product?.price || ''}" required /></label>
				<button type="submit">${buttonLabel}</button>
			</form>
		</section>
	`;
}

module.exports = {
	renderProductCards,
	renderProductForm
};
