const express = require('express');
const router = express.Router();

const {
  crearCotizacionHandler,
  obtenerCotizacionesPorCedulaHandler,
  actualizarEstadoCotizacionHandler
} = require('../../controllers/cotizaciones.controller');

router.post('/', crearCotizacionHandler);
router.get('/:cedula', obtenerCotizacionesPorCedulaHandler);
router.put('/:id', actualizarEstadoCotizacionHandler);

module.exports = router;
