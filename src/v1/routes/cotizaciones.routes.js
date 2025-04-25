// src/v1/routes/cotizaciones.routes.js
const express = require('express');
const router = express.Router();
const {
  crearCotizacionConDetalle,
  obtenerCotizacionesPorCedula
} = require('../../controllers/cotizaciones.controller');

// Crear cotización con detalle
router.post('/', crearCotizacionConDetalle);

// Obtener cotizaciones por cédula
router.get('/:cedula', obtenerCotizacionesPorCedula); // ← Aquí debe estar sin paréntesis

module.exports = router;
