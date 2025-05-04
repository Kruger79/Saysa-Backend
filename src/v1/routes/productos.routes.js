const express = require('express');
const router = express.Router();
const { obtenerProductos, getProductoById, createProducto, updateProducto, deleteProducto } = require('../../controllers/productos.controller');

// GET /api/v1/productos
router.get('/', obtenerProductos);
router.get('/:id', getProductoById);       // Obtener producto por ID
router.post('/', createProducto);          // Crear producto
router.put('/:id', updateProducto);        // Actualizar producto
router.delete('/:id', deleteProducto);     // Eliminar (desactivar) producto


module.exports = router;
