process.env.NODE_ENV = "test";

jest.mock("../models/Product.js", () => {
	const Product = {
		find: jest.fn(),
		findById: jest.fn(),
		create: jest.fn(),
		findByIdAndUpdate: jest.fn(),
		findByIdAndDelete: jest.fn(),
	};
	return { Product, Categories: [], Sizes: [] };
});

const request = require("supertest");
const app = require("../index.js");
const { Product } = require("../models/Product.js");

describe("Product routes", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("GET /api/products returns JSON list", async () => {
		Product.find.mockResolvedValueOnce([]);
		const res = await request(app).get("/api/products");
		expect(res.status).toBe(200);
		expect(res.body).toEqual([]);
	});

	test("GET /products returns HTML", async () => {
		Product.find.mockResolvedValueOnce([]);
		const res = await request(app).get("/products");
		expect(res.status).toBe(200);
		expect(res.text).toContain("<!DOCTYPE html>");
	});

	test("GET /api/products/:id returns 404 when missing", async () => {
		Product.findById.mockResolvedValueOnce(null);
		const res = await request(app).get("/api/products/123456789012");
		expect(res.status).toBe(404);
	});

	test("POST /api/products creates product", async () => {
		const payload = {
			nombre: "Test",
			descripcion: "Desc",
			imagen: "http://example.com/img.jpg",
			categoria: "Camisetas",
			talla: "M",
			precio: 10,
		};
		Product.create.mockResolvedValueOnce({ _id: "abc123", ...payload });
		const res = await request(app).post("/api/products").send(payload);
		expect(res.status).toBe(201);
		expect(res.body.nombre).toBe("Test");
	});
});
