// Importa Express y crea el router
const express = require('express');
const router = express.Router();

// Importa el controlador que actualizará el estado
const { actualizarEstadoPedido } = require('../../controllers/pedidos.controllers');

// Ruta PUT para actualizar el estado de un pedido (por ID)
router.put('/:id', actualizarEstadoPedido);

module.exports = router;
