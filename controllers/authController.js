const jwt = require('jsonwebtoken');
const User = require('../models/User');
const baseHtml = require('../helpers/baseHtml');
const getNavbar = require('../helpers/getNavbar');

function signToken(user) {
	const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
	return jwt.sign(
		{
			id: user._id,
			email: user.email,
			role: user.role
		},
		secret,
		{ expiresIn: '1d' }
	);
}

function sanitizeUser(user) {
	return {
		id: user._id,
		name: user.name,
		email: user.email,
		role: user.role
	};
}

async function registerApi(req, res) {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({ message: 'Faltan campos obligatorios' });
		}

		const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
		if (existingUser) {
			return res.status(409).json({ message: 'El email ya está registrado' });
		}

		const user = await User.create({ name, email, password });
		return res.status(201).json({ message: 'Usuario creado', user: sanitizeUser(user) });
	} catch (error) {
		return res.status(500).json({ message: 'Error al registrar usuario' });
	}
}

async function loginApi(req, res) {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: 'Email y password son obligatorios' });
		}

		const user = await User.findOne({ email: email.toLowerCase().trim() });
		if (!user) {
			return res.status(401).json({ message: 'Credenciales inválidas' });
		}

		const validPassword = await user.comparePassword(password);
		if (!validPassword) {
			return res.status(401).json({ message: 'Credenciales inválidas' });
		}

		const token = signToken(user);
		return res.json({ token, user: sanitizeUser(user) });
	} catch (error) {
		return res.status(500).json({ message: 'Error al iniciar sesión' });
	}
}

function showLogin(req, res) {
	const body = `
		${getNavbar()}
		<main class="container page">
			<section class="form-wrapper">
				<h1>Login</h1>
				<form method="POST" action="/login" class="stack">
					<label>Email<input type="email" name="email" required /></label>
					<label>Password<input type="password" name="password" required /></label>
					<button type="submit">Entrar</button>
				</form>
				<p>¿No tienes cuenta? <a href="/register">Regístrate</a></p>
			</section>
		</main>
	`;

	res.send(baseHtml({ title: 'Login', body }));
}

function showRegister(req, res) {
	const body = `
		${getNavbar()}
		<main class="container page">
			<section class="form-wrapper">
				<h1>Registro</h1>
				<form method="POST" action="/register" class="stack">
					<label>Nombre<input name="name" required /></label>
					<label>Email<input type="email" name="email" required /></label>
					<label>Password<input type="password" name="password" required /></label>
					<button type="submit">Crear cuenta</button>
				</form>
				<p>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
			</section>
		</main>
	`;

	res.send(baseHtml({ title: 'Registro', body }));
}

async function registerWeb(req, res) {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return res.status(400).send('Faltan campos obligatorios');
	}

	try {
		const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
		if (existingUser) {
			return res.status(409).send('El email ya está registrado');
		}

		await User.create({ name, email, password });
		return res.redirect('/login');
	} catch (error) {
		return res.status(500).send('Error al registrar usuario');
	}
}

async function loginWeb(req, res) {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).send('Email y password son obligatorios');
	}

	try {
		const user = await User.findOne({ email: email.toLowerCase().trim() });
		if (!user) {
			return res.status(401).send('Credenciales inválidas');
		}

		const validPassword = await user.comparePassword(password);
		if (!validPassword) {
			return res.status(401).send('Credenciales inválidas');
		}

		const token = signToken(user);
		res.cookie('token', token, {
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 24 * 60 * 60 * 1000
		});

		return res.redirect('/dashboard');
	} catch (error) {
		return res.status(500).send('Error al iniciar sesión');
	}
}

function logoutWeb(req, res) {
	res.clearCookie('token');
	res.redirect('/products');
}

module.exports = {
	registerApi,
	loginApi,
	showLogin,
	showRegister,
	registerWeb,
	loginWeb,
	logoutWeb
};
