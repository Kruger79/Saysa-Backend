const {
  crearCotizacion,
  obtenerCotizacionesPorCedula,
  actualizarEstadoCotizacion,
  actualizarTiempoEntregaHandler
} = require('../services/cotizaciones.service');

// Crear cotización (y guardar pedido automáticamente)
const crearCotizacionHandler = async (req, res) => {
  try {
    const { cedula, productos, nombreFinca, tiempoEntrega, precioEnvio} = req.body;

    if (!cedula || !productos || productos.length === 0) {
      return res.status(400).json({ mensaje: 'Datos incompletos para crear cotización' });
    }

    const resultado = await crearCotizacion(cedula, productos, nombreFinca, tiempoEntrega, precioEnvio);

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

// Cambiar estado de la cotización
const actualizarEstadoCotizacionHandler = async (req, res) => {
  try {
    const idCotizacion = req.params.id;
    const { estado } = req.body;

    await actualizarEstadoCotizacion(idCotizacion, estado);

    res.json({ mensaje: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar estado:', error);
    res.status(500).json({ mensaje: 'Error al actualizar estado', error });
  }
};

const actualizarTiempoEntregaHandler = async (req, res) => {
  try {
    const { idCotizacion, fechaEntrega } = req.body;
    if (!idCotizacion || !fechaEntrega) {
      return res.status(400).json({ mensaje: 'Datos incompletos para actualizar tiempo de entrega' });
    }
    await actualizarTiempoEntrega(idCotizacion, fechaEntrega);
    res.json({ mensaje: 'Tiempo de entrega actualizado correctamente' });
  } catch (error) {
    console.error("❌ Error al actualizar tiempo de entrega:", error);
    res.status(500).json({ mensaje: 'Error al actualizar tiempo de entrega', error });
  }
};


module.exports = {
  crearCotizacionHandler,
  obtenerCotizacionesPorCedulaHandler,
  actualizarEstadoCotizacionHandler,
  actualizarTiempoEntregaHandler
};
