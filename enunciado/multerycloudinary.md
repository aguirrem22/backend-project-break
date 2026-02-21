# Ejemplo de subida de imágenes a Cloudinary con multer
Cloudinary gestiona el hosting, genera URLs optimizadas y transforma imágenes al vuelo.

Instalación rápida
```bash
npm i cloudinary multer-storage-cloudinary multer
```

Config global (config/cloudinary.js)
```js
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
module.exports = cloudinary;
```

Middleware de subida('middlewares/uploadCloudinaryMiddleware)
```js
const multer  = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'tienda-ropa',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});
module.exports = multer({ storage });
```

uso de la ruta
```js
const upload = require('../middlewares/uploadMiddleware');
router.post('/dashboard', auth, upload.single('image'), productController.createProduct);

```
En tu controlador el path final estará en req.file.path → guárdalo como image dentro del documento Product.
