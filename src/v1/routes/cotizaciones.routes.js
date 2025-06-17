const express = require('express');
const router = express.Router();

const {
  crearCotizacionHandler,
  obtenerCotizacionesPorCedulaHandler,
  actualizarEstadoCotizacionHandler,
  actualizarFechaEntregaHandler
} = require('../../controllers/cotizaciones.controller');

router.post('/', crearCotizacionHandler);
router.put('/fecha-entrega', actualizarFechaEntregaHandler);
router.get('/:cedula', obtenerCotizacionesPorCedulaHandler);
router.put('/:id', actualizarEstadoCotizacionHandler);

module.exports = router;
