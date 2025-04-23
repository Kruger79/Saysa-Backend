// Importa las funciones del servicio de cotizaciones
const {
    crearCotizacionConDetalleService,
    obtenerCotizacionesService
  } = require('../services/cotizaciones.service');
  
  // Controlador para crear una cotización con detalle
  const crearCotizacionConDetalle = async (req, res) => {
    try {
      // Intenta crear la cotización y devuelve el resultado
      const resultado = await crearCotizacionConDetalleService(req.body);
      res.status(201).json(resultado);
    } catch (error) {
      // En caso de error, muestra mensaje por consola y responde con error
      console.error('❌ Error al crear cotización:', error);
      res.status(500).json({ error: error.message || 'Error al crear cotización' });
    }
  };
  
  // Controlador para obtener cotizaciones por cédula
  const obtenerCotizacionesPorCedula = async (req, res) => {
    const cedula = req.params.cedula;
    try {
      // Intenta obtener las cotizaciones asociadas a esa cédula
      const cotizaciones = await obtenerCotizacionesService(cedula);
      res.status(200).json(cotizaciones);
    } catch (error) {
      // En caso de error, muestra mensaje por consola y responde con error
      console.error('❌ Error al obtener cotizaciones:', error);
      res.status(500).json({ error: error.message || 'Error al obtener cotizaciones' });
    }
  };
  
  module.exports = {
    crearCotizacionConDetalle,
    obtenerCotizacionesPorCedula
  };
  