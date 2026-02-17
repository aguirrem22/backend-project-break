const baseHtml = require('../helpers/baseHtml');
const getNavbar = require('../helpers/getNavbar');

const isAuthenticated = (req) => req.cookies?.admin === 'true';

const renderPage = ({ title, req, content }) => {
	const body = `
		${getNavbar({ isAuthenticated: isAuthenticated(req) })}
		<main class="container">
			${content}
		</main>
	`;

	return baseHtml({ title, body });
};

const showLogin = (req, res) => {
	const hasError = Boolean(req.query.error);
	const content = `
		<section class="form-wrapper">
			<h1>Login</h1>
			${hasError ? '<p class="error">Credenciales incorrectas.</p>' : ''}
			<form action="/login" method="POST" class="stack">
				<label>Usuario<input name="username" required /></label>
				<label>Clave<input name="password" type="password" required /></label>
				<button type="submit">Entrar</button>
			</form>
		</section>
	`;

	res.send(renderPage({ title: 'Login', req, content }));
};

const login = (req, res) => {
	const { username, password } = req.body;
	const adminUser = process.env.ADMIN_USER;
	const adminPass = process.env.ADMIN_PASSWORD;
	if (username === adminUser && password === adminPass) {
		res.cookie('admin', 'true', {
			httpOnly: true,
			sameSite: 'lax',
		});
		return res.redirect('/dashboard');
	}

	return res.redirect('/login?error=1');
};

const logout = (req, res) => {
	res.clearCookie('admin');
	res.redirect('/products');
};

module.exports = {
	showLogin,
	login,
	logout,
};
