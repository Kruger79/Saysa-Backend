const {
  crearCotizacion,
  obtenerCotizacionesPorCedula
} = require('../services/cotizaciones.service');

// Crear cotización (y guardar pedido automáticamente)
const crearCotizacionHandler = async (req, res) => {
  try {
    const { cedula, productos, nombreFinca, tiempoEntrega} = req.body;

    if (!cedula || !productos || productos.length === 0) {
      return res.status(400).json({ mensaje: 'Datos incompletos para crear cotización' });
    }

    const resultado = await crearCotizacion(cedula, productos, nombreFinca, tiempoEntrega);

    res.status(201).json({
      mensaje: resultado.mensaje,
      idCotizacion: resultado.idCotizacion
    });
  } catch (error) {
    console.error("❌ Error al crear cotización:", error);
    res.status(500).json({ mensaje: 'Error al crear la cotización', error });
  }
};

// Obtener cotizaciones por cédula
const obtenerCotizacionesPorCedulaHandler = async (req, res) => {
  try {
    const cedula = req.params.cedula;

    if (!cedula) {
      return res.status(400).json({ mensaje: 'Cédula requerida' });
    }

    const cotizaciones = await obtenerCotizacionesPorCedula(cedula);
    res.json(cotizaciones);
  } catch (error) {
    console.error("❌ Error al obtener cotizaciones:", error);
    res.status(500).json({ mensaje: "Error al obtener cotizaciones", error });
  }
};

module.exports = {
  crearCotizacionHandler,
  obtenerCotizacionesPorCedulaHandler
};
