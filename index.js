require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(authRoutes);
app.use(productRoutes);

app.get('/', (req, res) => {
	res.redirect('/products');
});

app.use((err, req, res, next) => {
	console.error(err);
	if (req.originalUrl.startsWith('/api/')) {
		return res.status(500).json({ message: 'Error interno del servidor' });
	}
	return res.status(500).send('Error interno del servidor');
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
	connectDB()
		.then(() => {
			app.listen(PORT, () => {
				console.log(`Servidor escuchando en http://localhost:${PORT}`);
			});
		})
		.catch((error) => {
			console.error('Error conectando a la base de datos:', error.message);
			process.exit(1);
		});
}

module.exports = app;
