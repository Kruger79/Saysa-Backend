const express = require('express');
const router = express.Router();
const { obtenerPedidosPorCedula } = require('../../controllers/pedidos.controllers');

// GET /api/v1/pedidos/:cedula
router.get('/:cedula', obtenerPedidosPorCedula);

module.exports = router;
