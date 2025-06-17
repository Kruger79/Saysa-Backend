const express = require('express');
const router = express.Router();

const {
  crearCotizacionHandler,
  obtenerCotizacionesPorCedulaHandler,
  actualizarEstadoCotizacionHandler,
  actualizarFechaEntregaHandler,
  actualizarTiempoEntregaHandler
} = require('../../controllers/cotizaciones.controller');

router.put('/fecha-entrega', actualizarTiempoEntregaHandler);
router.post('/', crearCotizacionHandler);
router.get('/:cedula', obtenerCotizacionesPorCedulaHandler);
router.put('/:id', actualizarEstadoCotizacionHandler);

module.exports = router;
