// Importa el servicio que se comunica con la base de datos
const { actualizarEstadoEntrega } = require('../services/pedidos.service');

// Función que maneja la solicitud para actualizar estado
const actualizarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params;              // Extrae el ID de la URL
    const { estadoEntrega } = req.body;     // Extrae el nuevo estado del body

    // Llama al servicio que hace el cambio en la base de datos
    await actualizarEstadoEntrega(id, estadoEntrega);

    // Respuesta de éxito
    res.status(200).json({ mensaje: 'Estado del pedido actualizado correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar estado de pedido:', error);
    res.status(500).json({ error: error.message || 'Error al actualizar estado de pedido' });
  }
};

module.exports = { actualizarEstadoPedido };
