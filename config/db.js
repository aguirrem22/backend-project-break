const mongoose = require('mongoose');

async function connectDB() {
	const mongoUri = process.env.MONGO_URI;

	if (!mongoUri) {
		throw new Error('Falta la variable de entorno MONGO_URI');
	}

	await mongoose.connect(mongoUri);
	console.log('MongoDB conectado correctamente');
}

module.exports = connectDB;
