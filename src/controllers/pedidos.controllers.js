const pedidosService = require('../services/pedidos.service');

const getPedidos = async (req, res) => {
  try {
    const pedidos = await pedidosService.obtenerTodosLosPedidos();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pedidos', error });
  }
};

const getPedidosPorCedula = async (req, res) => {
  try {
    const cedula = req.params.cedula;
    const pedidos = await pedidosService.obtenerPedidosPorCedula(cedula);
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pedidos por cédula', error });
  }
};

module.exports = {
  getPedidos,
  getPedidosPorCedula
};
