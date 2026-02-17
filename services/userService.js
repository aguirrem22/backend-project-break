const User = require('./models/User');

async function findUserByEmail(email) {
	return User.findOne({ email: email.toLowerCase().trim() });
}

async function createUser(payload) {
	return User.create(payload);
}

module.exports = {
	findUserByEmail,
	createUser
};
