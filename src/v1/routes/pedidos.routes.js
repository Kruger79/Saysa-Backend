const express = require('express');
const router = express.Router();
const { guardarPedido, obtenerPedidosPorCedula } = require('../../controllers/pedidos.controllers');

router.post('/', guardarPedido);
router.get('/:cedula', obtenerPedidosPorCedula);

module.exports = router;
