const express = require('express');
const router = express.Router();
const { obtenerProductos } = require('../../controllers/productos.controller');

// GET /api/v1/productos
router.get('/', obtenerProductos);

module.exports = router;
