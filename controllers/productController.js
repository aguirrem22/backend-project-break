const { Product } = require('../models/Product');
const baseHtml = require('../helpers/baseHtml');
const getNavbar = require('../helpers/getNavbar');
const { renderProductCards, renderProductForm } = require('../helpers/template');

const normalizePrice = (value) => {
	if (typeof value === 'string') {
		return value.replace(',', '.');
	}
	return value;
};

const formatValidationError = (error) => {
	if (!error?.errors) return 'No se pudo guardar el producto.';
	const messages = Object.values(error.errors)
		.map((fieldError) => fieldError.message)
		.filter(Boolean);
	return messages.length ? messages.join(' ') : 'No se pudo guardar el producto.';
};

const isAuthenticated = (req) => req.cookies?.admin === 'true';

const renderPage = ({ title, req, content, isDashboard = false }) => {
	const body = `
		${getNavbar({ isAuthenticated: isAuthenticated(req), isDashboard })}
		<main class="container">
			${content}
		</main>
	`;

	return baseHtml({ title, body });
};

const renderNotFound = (req, message) =>
	renderPage({
		title: 'No encontrado',
		req,
		content: `<section class="stack"><h1>404</h1><p>${message}</p></section>`,
	});

const renderProductDetail = (product, { isDashboard = false } = {}) => {
	const price = Number(product.price || 0).toFixed(2);
	return `
		<section class="detail">
			<img src="${product.image}" alt="${product.name}" />
			<div class="detail-body">
				<h1>${product.name}</h1>
				<p class="muted">${product.category} - ${product.size}</p>
				<p>${product.description}</p>
				<p>${price} €</p>
				${isDashboard
					? `
					<div class="row">
						<a class="btn-edit" href="/dashboard/${product._id}/edit">Editar</a>
						<form action="/dashboard/${product._id}/delete?_method=DELETE" method="POST">
							<button type="submit" class="danger">Eliminar</button>
						</form>
					</div>
					`
					: ''}
			</div>
		</section>
	`;
};

const showProducts = async (req, res, next) => {
	try {
		const filter = {};
		if (req.query.category) {
			filter.category = req.query.category;
		}
		const products = await Product.find(filter).sort({ createdAt: -1 });
		const cards = renderProductCards(products, false);
		res.send(
			renderPage({
				title: 'Productos',
				req,
				content: `<h1>Catalogo</h1>${cards}`,
			})
		);
	} catch (error) {
		next(error);
	}
};

const showProductById = async (req, res, next) => {
	try {
		const product = await Product.findById(req.params.productId);
		if (!product) {
			return res.status(404).send(renderNotFound(req, 'Producto no encontrado.'));
		}
		const content = renderProductDetail(product, { isDashboard: false });
		return res.send(
			renderPage({
				title: product.name,
				req,
				content,
			})
		);
	} catch (error) {
		next(error);
	}
};

const showDashboard = async (req, res, next) => {
	try {
		const products = await Product.find().sort({ createdAt: -1 });
		const cards = renderProductCards(products, true);
		res.send(
			renderPage({
				title: 'Dashboard',
				req,
				content: `<h1>Dashboard</h1>${cards}`,
				isDashboard: true,
			})
		);
	} catch (error) {
		next(error);
	}
};

const showDashboardProduct = async (req, res, next) => {
	try {
		const product = await Product.findById(req.params.productId);
		if (!product) {
			return res.status(404).send(renderNotFound(req, 'Producto no encontrado.'));
		}
		const content = renderProductDetail(product, { isDashboard: true });
		return res.send(
			renderPage({
				title: product.name,
				req,
				content,
				isDashboard: true,
			})
		);
	} catch (error) {
		next(error);
	}
};

const showNewProduct = (req, res) => {
	const form = renderProductForm({
		product: null,
		action: '/dashboard',
		title: 'Nuevo producto',
		buttonLabel: 'Crear',
	});

	res.send(
		renderPage({
			title: 'Nuevo producto',
			req,
			content: form,
			isDashboard: true,
		})
	);
};

const createProduct = async (req, res, next) => {
	try {
		const { name, description, image, category, size, price } = req.body;
		const product = await Product.create({
			name,
			description,
			image,
			category,
			size,
			price: normalizePrice(price),
		});
		res.redirect(`/dashboard/${product._id}`);
	} catch (error) {
		if (error.name === 'ValidationError' || error.name === 'CastError') {
			const form = renderProductForm({
				product: req.body,
				action: '/dashboard',
				title: 'Nuevo producto',
				buttonLabel: 'Crear',
				errorMessage: formatValidationError(error),
			});
			return res.status(400).send(
				renderPage({
					title: 'Nuevo producto',
					req,
					content: form,
					isDashboard: true,
				})
			);
		}
		next(error);
	}
};

const showEditProduct = async (req, res, next) => {
	try {
		const product = await Product.findById(req.params.productId);
		if (!product) {
			return res.status(404).send(renderNotFound(req, 'Producto no encontrado.'));
		}
		const form = renderProductForm({
			product,
			action: `/dashboard/${product._id}`,
			method: 'PUT',
			title: 'Editar producto',
			buttonLabel: 'Guardar cambios',
		});
		return res.send(
			renderPage({
				title: 'Editar producto',
				req,
				content: form,
				isDashboard: true,
			})
		);
	} catch (error) {
		next(error);
	}
};

const updateProduct = async (req, res, next) => {
	try {
		const { name, description, image, category, size, price } = req.body;
		const product = await Product.findByIdAndUpdate(
			req.params.productId,
			{ name, description, image, category, size, price: normalizePrice(price) },
			{ new: true, runValidators: true }
		);
		if (!product) {
			return res.status(404).send(renderNotFound(req, 'Producto no encontrado.'));
		}
		res.redirect(`/dashboard/${product._id}`);
	} catch (error) {
		if (error.name === 'ValidationError' || error.name === 'CastError') {
			const form = renderProductForm({
				product: req.body,
				action: `/dashboard/${req.params.productId}`,
				method: 'PUT',
				title: 'Editar producto',
				buttonLabel: 'Guardar cambios',
				errorMessage: formatValidationError(error),
			});
			return res.status(400).send(
				renderPage({
					title: 'Editar producto',
					req,
					content: form,
					isDashboard: true,
				})
			);
		}
		next(error);
	}
};

const deleteProduct = async (req, res, next) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.productId);
		if (!product) {
			return res.status(404).send(renderNotFound(req, 'Producto no encontrado.'));
		}
		res.redirect('/dashboard');
	} catch (error) {
		next(error);
	}
};

module.exports = {
	showProducts,
	showProductById,
	showDashboard,
	showDashboardProduct,
	showNewProduct,
	createProduct,
	showEditProduct,
	updateProduct,
	deleteProduct,
};
