function getNavbar({ isAuthenticated = false, isDashboard = false } = {}) {
	const publicLinks = `
		<a href="/products">Productos</a>
		<a href="/products?category=Camisetas">Camisetas</a>
		<a href="/products?category=Pantalones">Pantalones</a>
		<a href="/products?category=Zapatos">Zapatos</a>
		<a href="/products?category=Accesorios">Accesorios</a>
	`;

	const authLinks = isAuthenticated
		? `
			<a href="/dashboard">Dashboard</a>
			${isDashboard ? '<a href="/dashboard/new">Nuevo</a>' : ''}
			<form action="/logout" method="POST"><button type="submit">Salir</button></form>
		`
		: '<a href="/login">Login</a>';

	return `
		<header class="navbar">
			<div class="container navbar-content">
				<div class="brand-spacer"></div>
				<nav class="nav-links">
					${publicLinks}
					${authLinks}
				</nav>
				<div class="brand-spacer"></div>
			</div>
		</header>
	`;
}

module.exports = getNavbar;
