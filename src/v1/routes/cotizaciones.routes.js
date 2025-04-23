const express = require('express');
const router = express.Router();

// Importa los controladores para manejar las solicitudes
const {
  crearCotizacionConDetalle,
  obtenerCotizacionesPorCedula
} = require('../../controllers/cotizaciones.controller');

// Ruta POST: Crear una nueva cotización con su detalle (carrito)
router.post('/', crearCotizacionConDetalle);

// Ruta GET: Obtener las cotizaciones hechas por un cliente usando la cédula
router.get('/:cedula', obtenerCotizacionesPorCedula);

module.exports = router;
