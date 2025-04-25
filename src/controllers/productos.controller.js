const { obtenerProductosService } = require('../services/productos.service');

const obtenerProductos = async (req, res) => {
  try {
    const productos = await obtenerProductosService();
    res.json(productos);
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

module.exports = { obtenerProductos };

