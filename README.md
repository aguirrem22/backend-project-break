# Backend Project Break
## Marco Aguirre y Alesandro Quiros

URL API: 
URL Produccion: 

## Requisitos
- [Node.js](https://nodejs.org/en)
- MongoDB Atlas (MONGO_URI)

## Instalacion
1. Instala dependencias:
```bash
npm install
```

2. Crea un archivo `.env` en la raiz con:
```
MONGO_URI=tu_uri_de_mongo
PORT=8080
SESSION_SECRET=tu_secreto
```

3. Arranca el servidor:
```bash
npm start
```

## Scripts
- `npm run dev`: servidor con watch
- `npm start`: servidor normal
- `npm test`: tests con Jest

## Endpoints HTML (SSR)
- `GET /products`: listado de productos
- `GET /products/:id`: detalle de producto
- `GET /dashboard`: listado admin
- `GET /dashboard/new`: formulario nuevo producto
- `POST /dashboard`: crear producto
- `GET /dashboard/:id`: detalle admin
- `GET /dashboard/:id/edit`: formulario editar
- `PUT /dashboard/:id`: actualizar producto
- `DELETE /dashboard/:id/delete`: eliminar producto

## Endpoints API (JSON)
- `GET /api/products`: listado de productos
- `GET /api/products/:id`: detalle de producto
- `POST /api/products`: crear producto
- `PUT /api/products/:id`: actualizar producto
- `DELETE /api/products/:id`: eliminar producto

## Login basico
- `GET /login`: activa sesion admin
- `GET /logout`: cierra sesion

## Notas
- Para editar y borrar desde formularios se usa `method-override`.
- En tests se omite la conexion a Mongo (NODE_ENV=test).

