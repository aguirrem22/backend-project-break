# Frontend - Project Break

Frontend en React + Vite para consumir la API JSON del proyecto.

## Requisitos de API

Este frontend espera una API base en `VITE_API_URL` con rutas tipo:

- `POST /auth/login`
- `POST /auth/register`
- `GET /products`
- `GET /products/:id`
- `POST /products` (protegida)
- `PUT /products/:id` (protegida)
- `DELETE /products/:id` (protegida)

## Configuración

1. Copia `.env.example` a `.env`
2. Ajusta la URL de la API:

```env
VITE_API_URL=http://localhost:3000/api
```

## Scripts

- `npm run dev` - modo desarrollo
- `npm run build` - build de producción
- `npm run preview` - previsualización del build
