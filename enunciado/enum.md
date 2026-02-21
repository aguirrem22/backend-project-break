# Creación de modelo y vista con `enum`

Modelo con *enum*, perfecto para `<select>` en el front.  
Mongoose impide guardar colores que no estén en la lista y simplifica la lógica del controlador.

---

## Modelo con `enum`

```js
// models/Product.js
const mongoose = require('mongoose');

const validColors = ['Rojo', 'Azul', 'Verde', 'Negro', 'Blanco'];  // enum de colores

const productSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  color: { type: String, enum: validColors, required: true },
  price: { type: Number, required: true, min: 0 }
});

module.exports = mongoose.model('Product', productSchema);
module.exports.validColors = validColors;   // exportado solo si lo necesitas en otros archivos
```

## Vista SSR
```js
exports.showNewProduct = (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Nuevo producto</title>
      </head>
      <body>
        <h1>Nuevo producto</h1>

        <form action="/dashboard" method="POST">
          <label for="name">Nombre</label>
          <input type="text" id="name" name="name" required>

          <!-- cada opción podría generarse con un bucle aprovechando los colores ya creados en el Schema -->
          <label for="color">Color</label>
          <select id="color" name="color" required>
            <option value="">— Selecciona —</option>
            <option value="Rojo">Rojo</option>
            <option value="Azul">Azul</option>
            <option value="Verde">Verde</option>
            <option value="Negro">Negro</option>
            <option value="Blanco">Blanco</option>
          </select>

          <label for="price">Precio (€)</label>
          <input type="number" id="price" name="price" min="0" step="0.01" required>

          <button type="submit">Guardar</button>
        </form>

        <p><a href="/dashboard">← Volver al dashboard</a></p>
      </body>
    </html>
  `;
  res.send(html);
};

```
