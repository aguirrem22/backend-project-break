const Product = require('../models/Product');
const baseHtml = require('../helpers/baseHtml');
const getNavbar = require('../helpers/getNavbar');
const { renderProductCards, renderProductForm } = require('../helpers/template');

function parsePrice(value) {
	const parsed = Number(value);
	if (Number.isNaN(parsed) || parsed < 0) {
		return null;
	}
	return parsed;
}

async function showProducts(req, res) {
	const filter = {};
	if (req.query.category) {
		filter.category = req.query.category;
	}

	const products = await Product.find(filter).lean();

	const body = `
		${getNavbar({ isAuthenticated: Boolean(req.user) })}
		<main class="container page">
			<h1>Productos</h1>
			${renderProductCards(products, false)}
		</main>
	`;

	res.send(baseHtml({ title: 'Tienda', body }));
}

async function showProductById(req, res) {
	const product = await Product.findById(req.params.productId).lean();
	if (!product) {
		return res.status(404).send('Producto no encontrado');
	}

	const body = `
		${getNavbar({ isAuthenticated: Boolean(req.user) })}
		<main class="container page">
			<article class="detail">
				<img src="${product.image}" alt="${product.name}" />
				<div class="stack">
					<h1>${product.name}</h1>
					<p class="muted">${product.category} · ${product.size}</p>
					<p>${product.description}</p>
					<p><strong>${product.price.toFixed(2)} €</strong></p>
					<a href="/products">Volver a tienda</a>
				</div>
			</article>
		</main>
	`;

	return res.send(baseHtml({ title: product.name, body }));
}

async function showDashboard(req, res) {
	const products = await Product.find().lean();
	const body = `
		${getNavbar({ isAuthenticated: true, isDashboard: true })}
		<main class="container page">
			<h1>Dashboard</h1>
			${renderProductCards(products, true)}
		</main>
	`;

	res.send(baseHtml({ title: 'Dashboard', body }));
}

function showNewProduct(req, res) {
	const form = renderProductForm({
		action: '/dashboard',
		method: 'POST',
		title: 'Nuevo producto',
		buttonLabel: 'Crear producto'
	});

	const body = `
		${getNavbar({ isAuthenticated: true, isDashboard: true })}
		<main class="container page">${form}</main>
	`;

	res.send(baseHtml({ title: 'Nuevo producto', body }));
}

async function createProduct(req, res) {
	const price = parsePrice(req.body.price);
	if (price === null) {
		if (req.originalUrl.startsWith('/api/')) {
			return res.status(400).json({ message: 'Precio inválido' });
		}
		return res.status(400).send('Precio inválido');
	}

	const product = await Product.create({
		name: req.body.name,
		description: req.body.description,
		image: req.body.image,
		category: req.body.category,
		size: req.body.size,
		price
	});

	if (req.originalUrl.startsWith('/api/')) {
		return res.status(201).json({ product });
	}

	return res.redirect(`/dashboard/${product._id}`);
}

async function showDashboardProduct(req, res) {
	const product = await Product.findById(req.params.productId).lean();
	if (!product) {
		return res.status(404).send('Producto no encontrado');
	}

	const body = `
		${getNavbar({ isAuthenticated: true, isDashboard: true })}
		<main class="container page">
			<article class="detail">
				<img src="${product.image}" alt="${product.name}" />
				<div class="stack">
					<h1>${product.name}</h1>
					<p class="muted">${product.category} · ${product.size}</p>
					<p>${product.description}</p>
					<p><strong>${product.price.toFixed(2)} €</strong></p>
					<div class="row">
						<a href="/dashboard/${product._id}/edit">Editar</a>
						<form action="/dashboard/${product._id}/delete?_method=DELETE" method="POST">
							<button type="submit" class="danger">Eliminar</button>
						</form>
					</div>
				</div>
			</article>
		</main>
	`;

	return res.send(baseHtml({ title: product.name, body }));
}

async function showEditProduct(req, res) {
	const product = await Product.findById(req.params.productId).lean();
	if (!product) {
		return res.status(404).send('Producto no encontrado');
	}

	const form = renderProductForm({
		product,
		action: `/dashboard/${product._id}`,
		method: 'PUT',
		title: 'Editar producto',
		buttonLabel: 'Actualizar producto'
	});

	const body = `
		${getNavbar({ isAuthenticated: true, isDashboard: true })}
		<main class="container page">${form}</main>
	`;

	res.send(baseHtml({ title: `Editar ${product.name}`, body }));
}

async function updateProduct(req, res) {
	const update = {
		name: req.body.name,
		description: req.body.description,
		image: req.body.image,
		category: req.body.category,
		size: req.body.size
	};

	if (req.body.price !== undefined) {
		const parsedPrice = parsePrice(req.body.price);
		if (parsedPrice === null) {
			if (req.originalUrl.startsWith('/api/')) {
				return res.status(400).json({ message: 'Precio inválido' });
			}
			return res.status(400).send('Precio inválido');
		}
		update.price = parsedPrice;
	}

	const product = await Product.findByIdAndUpdate(req.params.productId, update, {
		new: true,
		runValidators: true
	});

	if (!product) {
		if (req.originalUrl.startsWith('/api/')) {
			return res.status(404).json({ message: 'Producto no encontrado' });
		}
		return res.status(404).send('Producto no encontrado');
	}

	if (req.originalUrl.startsWith('/api/')) {
		return res.json({ product });
	}

	return res.redirect(`/dashboard/${product._id}`);
}

async function deleteProduct(req, res) {
	const product = await Product.findByIdAndDelete(req.params.productId);
	if (!product) {
		if (req.originalUrl.startsWith('/api/')) {
			return res.status(404).json({ message: 'Producto no encontrado' });
		}
		return res.status(404).send('Producto no encontrado');
	}

	if (req.originalUrl.startsWith('/api/')) {
		return res.status(204).send();
	}

	return res.redirect('/dashboard');
}

async function getProductsApi(req, res) {
	const filter = {};
	if (req.query.category) {
		filter.category = req.query.category;
	}

	const products = await Product.find(filter).lean();
	return res.json({ products });
}

async function getProductByIdApi(req, res) {
	const product = await Product.findById(req.params.productId).lean();
	if (!product) {
		return res.status(404).json({ message: 'Producto no encontrado' });
	}

	return res.json({ product });
}

module.exports = {
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
};
