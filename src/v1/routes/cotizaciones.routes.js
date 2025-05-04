const express = require('express');
const router = express.Router();

const {
  crearCotizacionHandler,
  obtenerCotizacionesPorCedulaHandler
} = require('../../controllers/cotizaciones.controller');

router.post('/', crearCotizacionHandler);
router.get('/:cedula', obtenerCotizacionesPorCedulaHandler);

module.exports = router;
