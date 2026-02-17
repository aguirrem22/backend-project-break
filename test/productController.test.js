const request = require('supertest');
const app = require('../index');

describe('Servidor SSR', () => {
	it('GET /login responde correctamente', async () => {
		const response = await request(app).get('/login');

		expect(response.statusCode).toBe(200);
	});
});
