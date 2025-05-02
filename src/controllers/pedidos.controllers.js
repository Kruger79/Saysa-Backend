// src/controllers/pedidos.controllers.js
const { guardarPedidoService, obtenerPedidosPorCedulaService } = require('../services/pedidos.service');

// POST: guardar pedido
const guardarPedido = async (req, res) => {
  const { cedula, productos } = req.body;

  if (!cedula || !Array.isArray(productos)) {
    return res.status(400).json({ error: 'Datos incompletos para guardar el pedido.' });
  }

  try {
    await guardarPedidoService(cedula, productos);
    res.status(201).json({ mensaje: 'Pedido guardado con éxito.' });
  } catch (error) {
    console.error('❌ Error al guardar pedido:', error);
    res.status(500).json({ error: 'Error al guardar el pedido.' });
  }
};

// GET: obtener pedidos por cédula
const obtenerPedidosPorCedula = async (req, res) => {
  const { cedula } = req.params;

  try {
    const pedidos = await obtenerPedidosPorCedulaService(cedula);
    res.json(pedidos);
  } catch (error) {
    console.error('❌ Error al obtener pedidos por cédula:', error);
    res.status(500).json({ error: 'Error al obtener pedidos por cédula.' });
  }
};

module.exports = {
  guardarPedido,
  obtenerPedidosPorCedula,
};
