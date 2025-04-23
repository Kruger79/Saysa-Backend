const sql = require('mssql');
const db = require('../database/config');

// Función que actualiza el estado de un pedido en la base de datos
const actualizarEstadoEntrega = async (idPedido, estadoEntrega) => {
  try {
    const pool = await db.getConnection();

    // Lista de estados válidos para verificar
    const estadosValidos = ['Pendiente', 'En proceso', 'Entregado'];

    // Si el estado no es válido, lanza error
    if (!estadosValidos.includes(estadoEntrega)) {
      throw new Error('Estado de entrega no válido');
    }

    // Ejecuta el UPDATE en SQL Server
    await pool.request()
      .input('IdPedido', sql.Int, idPedido)
      .input('EstadoEntrega', sql.NVarChar, estadoEntrega)
      .query(`UPDATE Pedidos SET EstadoEntrega = @EstadoEntrega WHERE IdPedido = @IdPedido`);

  } catch (error) {
    console.error('❌ Error en actualizarEstadoEntrega:', error);
    throw error;
  }
};

module.exports = { actualizarEstadoEntrega };
