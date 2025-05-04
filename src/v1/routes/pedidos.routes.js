const express = require('express');
const router = express.Router();
const pedidosController = require('../../controllers/pedidos.controllers');

// GET todos los pedidos (para admin dashboard)
router.get('/', pedidosController.getPedidos);

// GET pedidos por cédula (ya existente)
router.get('/:cedula', pedidosController.getPedidosPorCedula);

module.exports = router;
