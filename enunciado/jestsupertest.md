# Testing de rutas jest + supertest
Vamos a crear un test sin levantar BBDD con jest.mock(). Sustituye el modelo por funciones falsas; la lógica del controlador se prueba en milisegundos.
Con Supertest reproduce exactamente lo que haría un cliente, incluida la cabecera, el cuerpo JSON y el status code. Y así también comprobarlo.

## Instalando las dependencias
```bash
npm i -D jest supertest
```

## 1. Controlador para crear un elemento
```js
const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

// en routes/productRoutes.js estará lo siguiente
const express = require('express');
const router = express.Router();
const { createProduct } = require('../controllers/productController');

router.post('/create', createProduct);
module.exports = router;
```

## 2. Test (test/products.post.test.js)

```js
const express  = require('express');
const request  = require('supertest');
const { createProduct } = require('../controllers/productController');
const Product = require('../models/Product');

// ← evita acceso a Mongo. Jest sustituye automáticamente ese módulo por un objeto “falso” donde todas las funciones son mocks (jest.fn()).
jest.mock('../models/Product');

describe('POST /create', () => {
  // 1. Crea una mini-app expresamente para el test
  const app = express();
  app.use(express.json());
  app.post('/create', createProduct);

  it('responde 201 con el producto creado', async () => {
    const body = { name: 'Gorra', color: 'Negro', price: 9.99 };
    const fakeDoc = { _id: 'abc123', ...body };
    //mockResolvedValue() es un atajo de Jest para decirle a un mock “cuando te llamen, devuélveme esta promesa resuelta”.
    Product.create.mockResolvedValue(fakeDoc);

    const res = await request(app).post('/products').send(body);
    Testeamos el resultado
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ _id: 'abc123', name: 'Gorra', color: 'Negro', price: 9.99 });
  });
});
```

## Podemos añadir un ejemplo de error básico que es si falta algún elemento:

### Error para crear un elemento
```js
if (!req.body?.name || !req.body?.color) {
  return res.status(400).json({ error: 'Faltan campos obligatorios' });
}
```

### Test (test/products.post.test.js)
```js
it('devuelve 400 si falta el nombre', async () => {
  await request(app)
    .post('/products')
    .send({ color: 'Rojo', price: 9.99 })   // sin name
    .expect(400);
});
```

