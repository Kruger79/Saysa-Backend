const {
  crearCotizacionConDetalleService,
  obtenerCotizacionesService
} = require('../services/cotizaciones.service');

// Controlador para crear una cotización con detalle
const crearCotizacionConDetalle = async (req, res) => {
  try {
    const { cedula, productos } = req.body;

    if (!cedula || !productos || !Array.isArray(productos)) {
      return res.status(400).json({ error: 'Datos inválidos para la cotización' });
    }

    const resultado = await crearCotizacionConDetalleService(cedula, productos);
    res.status(201).json({ mensaje: 'Cotización creada exitosamente', resultado });
  } catch (error) {
    console.error('❌ Error al crear cotización:', error);
    res.status(500).json({ error: 'Error al crear cotización' });
  }
};

// Controlador para obtener cotizaciones por cédula
const obtenerCotizacionesPorCedula = async (req, res) => {
  try {
    const { cedula } = req.params;
    if (!cedula) {
      return res.status(400).json({ error: 'Cédula no proporcionada' });
    }

    const cotizaciones = await obtenerCotizacionesService(cedula);
    res.status(200).json(cotizaciones);
  } catch (error) {
    console.error('❌ Error al obtener cotizaciones:', error);
    res.status(500).json({ error: 'Error al obtener cotizaciones' });
  }
};

module.exports = {
  crearCotizacionConDetalle,
  obtenerCotizacionesPorCedula
};