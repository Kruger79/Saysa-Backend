const { obtenerPedidosPorCedulaService } = require('../services/pedidos.service');

const obtenerPedidosPorCedula = async (req, res) => {
  const cedula = req.params.cedula;

  try {
    const pedidos = await obtenerPedidosPorCedulaService(cedula);
    res.json(pedidos);
  } catch (error) {
    console.error('❌ Error al obtener pedidos por cédula:', error);
    res.status(500).json({ error: 'Error al obtener pedidos por cédula' });
  }
};

module.exports = {
  obtenerPedidosPorCedula
};
